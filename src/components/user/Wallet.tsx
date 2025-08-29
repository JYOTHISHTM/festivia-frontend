import { useEffect, useState } from 'react';
import Sidebar from '../layout/user/SideBar';
import Navbar from '../layout/user/HomeNavbar';
import { BASE_URL } from '../../config/config';
import { API_CONFIG } from '../../config/config';
import { useNavigate } from 'react-router';

const WalletComponent = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'add' | 'refund' | 'deduct'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const userData = localStorage.getItem('user');
  const userId = userData ? JSON.parse(userData)._id : null;


  const fetchWallet = async () => {
    if (!userId) {
      setMessage('User not logged in');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/${API_CONFIG.USER_ENDPOINTS.WALLET_ENDPOINT}/${userId}`);
      const data = await res.json();
      if (res.ok) {
        const walletData = data.data;
        setBalance(walletData.balance || 0);
        if (Array.isArray(walletData.transactions)) {
          setTransactions(walletData.transactions.slice().reverse());
        } else {
          setTransactions([]);
        }
        setMessage('');
      } else {
        setMessage(data.message || 'Failed to fetch wallet');
      }
    } catch (err) {
            const error=err as Error

      setMessage(error.message || 'Failed to fetch wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const updateWallet = async (userId: string, amount: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/${API_CONFIG.USER_ENDPOINTS.ADD_MONEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || 'Failed to update wallet' };
      }
    } catch (err) {
                  const error=err as Error
      return { success: false, error: error.message || 'Failed to update wallet' };
    } finally {
      setIsLoading(false);
    }
  };

  const createStripeSession = async (userId: string, amount: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/${API_CONFIG.USER_ENDPOINTS.CHECKOUT_SESSION}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || 'Stripe session failed' };
      }
    } catch (err) {
                  const error=err as Error
      return { success: false, error: error.message || 'Stripe session failed' };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const processPayment = async () => {
      if (isProcessingPayment) return;

      const urlParams = new URLSearchParams(window.location.search);
      const userIdParam = urlParams.get('userId');
      const amountParam = urlParams.get('amount');

      if (!userIdParam || !amountParam) return;

      const paymentKey = `wallet_payment_${userIdParam}_${amountParam}_${Date.now()}`;

      const recentPayments = Object.keys(localStorage)
        .filter(key => key.startsWith(`wallet_payment_${userIdParam}_${amountParam}`))
        .filter(key => {
          const timestamp = localStorage.getItem(key + '_timestamp');
          if (!timestamp) return false;
          return Date.now() - parseInt(timestamp) < 5 * 60 * 1000;
        });

      if (recentPayments.length > 0) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        return;
      }

      setIsProcessingPayment(true);

      try {
        localStorage.setItem(paymentKey, 'processing');
        localStorage.setItem(paymentKey + '_timestamp', Date.now().toString());


        const response = await updateWallet(userIdParam, parseInt(amountParam, 10));

        if (response.success) {
          localStorage.setItem(paymentKey, 'completed');
          localStorage.setItem(paymentKey + '_timestamp', Date.now().toString());
          setMessage('Money added successfully.');
          await fetchWallet();

          Object.keys(localStorage)
            .filter(key => key.startsWith('wallet_payment_'))
            .forEach(key => {
              const timestampKey = key + '_timestamp';
              const timestamp = localStorage.getItem(timestampKey);
              if (timestamp && Date.now() - parseInt(timestamp) > 60 * 60 * 1000) {
                localStorage.removeItem(key);
                localStorage.removeItem(timestampKey);
              }
            });
        } else {
          localStorage.removeItem(paymentKey);
          localStorage.removeItem(paymentKey + '_timestamp');
          setMessage(response.error || 'Failed to add money');
        }
      } catch (err) {
        console.error('Error processing wallet update:', err);
        localStorage.removeItem(paymentKey);
        localStorage.removeItem(paymentKey + '_timestamp');
        setMessage('An error occurred while processing payment');
      }

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      setIsProcessingPayment(false);
    };

    processPayment();
  }, []);


  useEffect(() => {
    if (!userId) {
      navigate('/user/login');
    } else {
      fetchWallet();
    }
  }, [navigate, userId]);

  const handleAdd = async () => {
  if (!userId) return navigate('/user/login');

  const parsedAmount = parseInt(amount, 10);

  if (!amount || isNaN(parsedAmount) || parsedAmount < 100 || parsedAmount > 9999) {
    setMessage('Please enter a valid amount between ₹100 and ₹9999');
    return;
  }

  setMessage(''); // Clear previous errors

  const response = await createStripeSession(userId, parsedAmount);
  if (response.success) {
    window.location.href = response.data.url;
  } else {
    setMessage(response.error);
  }
};


  const filteredTransactions = transactions.filter((txn) =>
    filter === 'all' ? true : txn.type === filter
  );

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto mt-28">
          <div className="mb-8">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Available Balance</h3>
            <div className="flex items-center justify-between mb-6">
              <div className="text-4xl font-semibold text-gray-900">
                ₹{(balance ?? 0).toFixed(2)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={isLoading}
                  className={`bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Processing...' : 'Add'}
                </button>
              </div>
            </div>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (₹100 - ₹9999)"
              min={100}
              max={9999}
              className={`p-3 border ${message ? 'border-red-500' : 'border-gray-200'
                } rounded-lg w-full focus:outline-none focus:ring-1 ${message ? 'focus:ring-red-500' : 'focus:ring-gray-400'
                } transition-all`}
              disabled={isLoading}
            />

            {message && (
              <p className="mt-2 text-sm text-red-600 font-medium">{message}</p>
            )}

          </div>

          <div className="mb-6">
            <div className="inline-flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setFilter('refund')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'refund' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Refunds
              </button>
              <button
                onClick={() => setFilter('add')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'add' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Credited
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'all' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                All
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Amount</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Type</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="px-6 py-4 text-center text-gray-500" colSpan={3}>
                      Loading transactions...
                    </td>
                  </tr>
                ) : paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((txn, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">₹{txn.amount}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(txn.date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${txn.type === 'add'
                            ? 'bg-green-50 text-green-700'
                            : txn.type === 'deduct'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-blue-50 text-blue-700'
                            }`}
                        >
                          {txn.type === 'add'
                            ? 'Credited'
                            : txn.type === 'deduct'
                              ? 'Deducted'
                              : 'Refund'}
                        </span>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 text-center text-gray-500" colSpan={3}>
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 0 && (
            <div className="mt-4 flex justify-center">
              <div className="inline-flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${currentPage === i + 1
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WalletComponent;