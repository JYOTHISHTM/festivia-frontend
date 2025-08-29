import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Payment successful!');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-10 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
        <p className="text-gray-600 mb-6">Your subscription has been activated.</p>
        <button
          onClick={() => navigate('/creator/subscription-details')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Go to Subscription Details
        </button>
      </div>
    </div>
  );
}
