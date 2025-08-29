import { useEffect, useState } from 'react';
import SidebarNavigation from '../layout/creator/SideBar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { creatorService } from '../../services/creator/creatorService'
import { BASE_URL } from "../../config/config";
import { API_CONFIG } from "../../config/config";


export default function SubscriptionDetails() {
  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [hasActivePlan, setHasActivePlan] = useState(false);

  type Creator = {
    id: string;
    name: string;
    email: string;
  };

  const [creator, setCreator] = useState<Creator | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedCreator = JSON.parse(localStorage.getItem("creator") || "{}");
    const storedToken = localStorage.getItem("accessToken");
    // const storedToken = localStorage.getItem("creatorToken");

    setCreator(storedCreator);
    setToken(storedToken);
  }, []);


  useEffect(() => {
    if (creator?.id && token) {
      const fetchSubscription = async () => {
        try {
          const data = await creatorService.getCurrentSubscription(token);
          if (data) {
            setPlan(data);
            setHasActivePlan(true);
          } else {
            setHasActivePlan(false);
          }
        } catch (err) {
          console.error("Error fetching subscription", err);
          setHasActivePlan(false);
        } finally {
          setLoading(false);
        }
      };

      fetchSubscription();
    }
  }, [creator?.id, token]);

  useEffect(() => {
    const fetchAllPlans = async () => {
      try {
        const plans = await creatorService.getAllSubscriptions();
        setAllPlans(plans);
      } catch (err) {
        console.error("Error fetching all plans", err);
      }
    };

    fetchAllPlans();
  }, []);





  const handleBuyNow = async (planName: string) => {
    if (!creator?.id || !token) {
      Swal.fire('Error', 'Creator ID or token missing.', 'error');
      return;
    }

    const result = await Swal.fire({
      title: `Are you sure you want to buy ${planName} plan?`,
      text: "This will deduct from your wallet!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, buy it!'
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.post(
          `${BASE_URL}/${API_CONFIG.CREATOR.ENDPOINTS.BUY_USING_WALLET}`,
          {
            creatorId: creator.id,
            planName
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        Swal.fire('Success!', data.message, 'success').then(() => {
          window.location.reload();
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || "Failed to buy using wallet.";
        Swal.fire('Error', msg, 'error');
      }
    }
  };



  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarNavigation />

      <main className="flex-1 flex items-center justify-center p-6">
        {loading ? (
          <p className="text-gray-600 text-xl">Loading...</p>
        ) : hasActivePlan ? (
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all hover:scale-105">
            <div className="text-sm font-semibold text-white bg-blue-500 px-3 py-1 rounded-full mb-4 inline-block">
              ACTIVE PLAN
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{plan.name}</h2>
            <p className="text-2xl text-indigo-600 font-extrabold mb-4">
              ₹{plan.price} <span className="text-base font-medium text-gray-500">/ {plan.days} days</span>
            </p>

            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={async () => {
                try {
                  if (!creator || !creator.id) {
                    console.warn("Creator or creator.id is undefined!", creator);
                    return;
                  }

                  const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: 'This will cancel your current subscription.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, cancel it!',
                    cancelButtonText: 'No, keep it'
                  });

                  if (result.isConfirmed) {
                    await axios.patch(
                      `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.CANCEL_SUBSCRIPTION(creator.id)}`,
                      {},
                      {
                        headers: { Authorization: `Bearer ${token}` }
                      }
                    );

                    await Swal.fire({
                      icon: 'success',
                      title: 'Cancelled',
                      text: 'Your subscription has been cancelled.',
                      confirmButtonColor: '#3085d6'
                    });

                    window.location.reload();
                  }
                } catch (err) {
                  console.error("Error expiring subscription", err);
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong while cancelling the subscription.',
                  });
                }
              }}
            >
              Cancel Subscription
            </button>


          </div>

        ) : (
          <div className="text-center text-gray-600 bg-white shadow-md p-10 rounded-xl w-full max-w-3xl">
            <p className="text-2xl font-semibold text-gray-800 mb-2">You don’t have any subscription.</p>
            <p className="text-base text-gray-500 mb-8">Choose a plan below to get started with your subscription.</p>

            {allPlans.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {allPlans.map((plan) => (
                  <div key={plan._id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-xl transform transition-all hover:scale-105">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-indigo-600 text-lg font-semibold">₹{plan.price}</p>
                      <p className="text-sm text-gray-500">{plan.days} days validity</p>
                    </div>

                    <hr className="my-4" />

                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-full w-full transition"
                      onClick={() => handleBuyNow(plan.name)}
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No plans available at the moment.</p>
            )}
          </div>

        )}
      </main>
    </div>
  );
}
