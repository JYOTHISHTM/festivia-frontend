import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { creatorService } from "../../services/creator/creatorService";
import { BASE_URL } from "../../config/config";
import { API_CONFIG } from "../../config/config";
import Swal from 'sweetalert2';

const PendingPage = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const [creatorStatus, setCreatorStatus] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!creatorId) {
      console.error("No creatorId found");
      return;
    }

    const fetchCreatorStatus = async () => {
      try {
        const data = await creatorService.getCreatorStatus(creatorId);
        setCreatorStatus(data.status);
        setRejectionReason(data.rejectionReason || null);
      } catch (error) {
        console.error("Error fetching creator status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (creatorId) {
      fetchCreatorStatus();
    }
  }, [creatorId]);

  useEffect(() => {
    if (creatorStatus === "approved") {
      navigate("/creator/dashboard");
    }
    else if (creatorStatus === "rejected") {
      navigate(`/creator/pending-page/${creatorId}`);
    }
  }, [creatorStatus, creatorId, navigate]);

  if (loading) {
    return <div className="text-center mt-20">Loading status...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-green-100 p-8 rounded-lg shadow-md w-160  text-center">
        {creatorStatus === "approved" ? (
          <>
            <h2 className="text-xl font-semibold text-green-600 mb-4">Your account has been approved!</h2>
            <p className="text-gray-700">You can now access all creator features.</p>
          </>
        ) : creatorStatus === "pending" ? (
          <>
            <h2 className="text-xl font-semibold text-yellow-500 mb-4">Your account is under review</h2>
            <p className="text-gray-700">We're currently reviewing your account. This usually takes 1-2 business days.</p>
          </>
        ) : creatorStatus === "rejected" ? (
          <>
            <h2 className="text-xl font-semibold text-red-600 mb-4">Your account has been rejected</h2>
            {rejectionReason && (
              <p className="mt-2 text-gray-700">Reason: {rejectionReason}</p>
            )}
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`${BASE_URL}/${API_CONFIG.ADMIN_ENDPOINTS.CREATOR_REAPPLY(creatorId as string)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                  });

                  const data = await res.json();

                  if (res.ok) {
                    Swal.fire({
                      icon: 'success',
                      title: 'Reapplied successfully!',
                      confirmButtonColor: '#3085d6',
                    });
                    setCreatorStatus('pending');
                    setRejectionReason(null);
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: data.message || 'Failed to reapply',
                    });
                  }
                } catch (err) {
                  console.error(err);
                  Swal.fire({
                    icon: 'error',
                    title: 'Something went wrong',
                    text: 'Please try again later.',
                  });
                }
              }}
              className="bg-black text-white rounded-xl w-25 h-10 mt-5"
            >
              REAPPLY
            </button>


          </>
        ) : (
          <h2 className="text-xl font-semibold text-gray-600">Unknown status. Please contact support.</h2>
        )}
      </div>
    </div>
  );
};

export default PendingPage;
