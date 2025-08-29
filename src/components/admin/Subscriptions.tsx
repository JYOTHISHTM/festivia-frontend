import { useEffect, useState } from 'react';
import { createSubscription, getAllSubscriptions, deleteSubscription } from '../../services/admin/adminService';
import Sidebar from '../layout/admin/SideBar';
import Swal from 'sweetalert2';

export default function AdminSubscription() {
  const [plans, setPlans] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [touched, setTouched] = useState<any>({});
  const [form, setForm] = useState({
    name: '',
    price: '',
    days: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllSubscriptions();
        setPlans(data);
      } catch {
        console.log("Failed to fetch plans");
      }
    };

    fetchPlans();
  }, []);

 const validate = () => {
  const errs: any = {};

  if (
    !form.name.trim() ||                         
    !/[a-zA-Z0-9]/.test(form.name)              
  ) {
    errs.name = "Name must contain valid characters";
  }

  if (
    !form.price ||
    isNaN(+form.price) ||
    +form.price < 100 ||
    +form.price > 3000
  ) {
    errs.price = "Price must be between 100 and 3000";
  }

  if (
    !form.days ||
    isNaN(+form.days) ||
    +form.days < 10 ||
    +form.days > 100
  ) {
    errs.days = "Days must be between 10 and 100";
  }

  return errs;
};


  useEffect(() => {
    const errs = validate();
    setErrors(errs);
    setIsValid(Object.keys(errs).length === 0);
  }, [form]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    if (name === 'price' || name === 'days') {
      if (!/^\d*$/.test(value)) return;
    }

    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleBlur = (e: any) => {
    setTouched((prev: any) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async () => {
    setTouched({ name: true, price: true, days: true, features: true });
    const errs = validate();
    if (Object.keys(errs).length > 0) return;

    const isDuplicate = plans.some(
      (plan) =>
        plan.name.trim().toLowerCase() === form.name.trim().toLowerCase() ||
        Number(plan.price) === Number(form.price) ||
        Number(plan.days) === Number(form.days)
    );

    if (isDuplicate) {
      Swal.fire({
        icon: 'error',
        title: 'Duplicate Found',
        text: 'A subscription with the same name, price, or duration already exists.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        days: Number(form.days),
      };
      await createSubscription(payload);
      Swal.fire({
        icon: 'success',
        title: 'Subscription Created!',
        confirmButtonColor: '#3085d6'
      });
      setForm({ name: '', price: '', days: '' });
      setShowModal(false);
      const res = await getAllSubscriptions()
      setPlans(res.data);
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: 'There was an error creating the subscription.',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleDeletePlan = async (planId: string) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the subscription plan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        await deleteSubscription(planId)
        setPlans((prevPlans) => prevPlans.filter((plan) => plan._id !== planId));
        Swal.fire('Deleted!', 'Subscription plan has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete subscription.', 'error');
      }
    }
  };



  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 ">
        {/* Create Subscription Button */}
        <div className="mb-6 text-center mt-10">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => {
              if (plans.length >= 4) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Maximum Limit Reached',
                  text: 'Only 4 subscriptions can be created.',
                  confirmButtonColor: '#3085d6'
                });
                return;
              }
              setShowModal(true);
            }}
          >
            Create Subscription
          </button>
        </div>


        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button className="absolute top-2 right-3 text-gray-600" onClick={() => setShowModal(false)}>✖</button>
              <h2 className="text-xl font-semibold mb-4">Create Subscription</h2>
              {["name", "price", "days"].map(field => (
                <div key={field} className="mb-4">
                  <label className="block mb-1 capitalize">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full border px-3 py-2 rounded"
                  />
                  {touched[field] && errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}


              <button
                disabled={!isValid || isSubmitting}
                onClick={handleSubmit}
                className={`w-full py-2 rounded text-white ${!isValid || isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        )}

        {/* Subscription Cards */}
        <div className="flex flex-wrap gap-6 justify-center">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all hover:scale-105"
            >

              <h2 className="text-3xl font-bold text-gray-800 mb-2">{plan.name}</h2>
              <p className="text-2xl text-indigo-600 font-extrabold mb-4">
                ₹{plan.price} <span className="text-base font-medium text-gray-500">/ {plan.days} days</span>
              
              </p>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handleDeletePlan(plan._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
