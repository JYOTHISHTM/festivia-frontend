import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import Sidebar from '../layout/creator/SideBar';
import { BASE_URL } from '../../config/config';
import { API_CONFIG } from '../../config/config';

const WalletComponent = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'add' | 'deduct'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const itemsPerPage = 5;
  const navigate = useNavigate()

  const creatorData = localStorage.getItem('creator');
  const creatorId = creatorData ? JSON.parse(creatorData).id : null;

  const WALLET_ENDPOINT = `${BASE_URL}/${API_CONFIG.CREATOR.ENDPOINTS.WALLET_ENDPOINT}`;

  const fetchWallet = useCallback(async () => {
    if (!creatorId) {
      setMessage('Creator not logged in');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${WALLET_ENDPOINT}/${creatorId}`);
      const data = await res.json();
      if (res.ok) {
        const walletData = data.data;
        setBalance(walletData.balance || 0);
        if (Array.isArray(walletData.transactions)) {
          const uniqueTransactions = walletData.transactions.slice().reverse();
          setTransactions(uniqueTransactions);
        } else {
          setTransactions([]);
        }
        setMessage('');
      } else {
        setMessage(data.message || 'Failed to fetch wallet');
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to fetch wallet');
    } finally {
      setIsLoading(false);
    }
  }, [creatorId, WALLET_ENDPOINT]);

  const updateWallet = async (creatorId: string, amount: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/${API_CONFIG.CREATOR.ENDPOINTS.ADD_MONEY_TO_WALLET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId, amount }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || 'Failed to update wallet' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update wallet' };
    } finally {
      setIsLoading(false);
    }
  };

  const createStripeSession = async (creatorId: string, amount: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/${API_CONFIG.CREATOR.ENDPOINTS.CHECKOUT_SESSION}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId, amount }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || 'Stripe session failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Stripe session failed' };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isProcessingPayment) return;

    const processPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const creatorIdParam = urlParams.get('creatorId');
      const amountParam = urlParams.get('amount');

      if (creatorIdParam && amountParam) {
        setIsProcessingPayment(true);

        const paymentKey = `creator_payment_${creatorIdParam}_${amountParam}`;

        if (!sessionStorage.getItem(paymentKey)) {
          try {
            sessionStorage.setItem(paymentKey, 'processing');

            const response = await updateWallet(creatorIdParam, parseInt(amountParam, 10));

            if (response.success) {
              sessionStorage.setItem(paymentKey, 'completed');
              setMessage('Money added successfully.');

              await fetchWallet();
            } else {
              sessionStorage.removeItem(paymentKey);
              setMessage(response.error);
            }

            window.history.replaceState({}, document.title, '/creator/wallet');
          } catch (error) {
            sessionStorage.removeItem(paymentKey);
            setMessage('An error occurred processing your payment');
          } finally {
            setIsProcessingPayment(false);
          }
        } else {
          window.history.replaceState({}, document.title, '/creator/wallet');
          setIsProcessingPayment(false);
        }
      }
    };

    processPayment();
  }, [fetchWallet, isProcessingPayment]);


  useEffect(() => {
    console.log("selectedMedia:", message);
  }, [message]);


  useEffect(() => {
    if (!creatorId) {
      navigate('/creator/login');
    } else {
      fetchWallet();
    }
  }, [navigate, creatorId, fetchWallet]);

  // const handleAdd = async () => {
  //   if (!creatorId) return navigate('/creator/login');
  //   if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
  //     setMessage('Please enter a valid amount');
  //     return;
  //   }

  //   const parsedAmount = parseInt(amount, 10);
  //   const response = await createStripeSession(creatorId, parsedAmount);
  //   if (response.success) {
  //     window.location.href = response.data.url;
  //   } else {
  //     setMessage(response.error);
  //   }
  // };

  const handleAdd = async () => {
  if (!creatorId) return navigate('/creator/login');

  const parsedAmount = parseInt(amount, 10);

  if (!amount || isNaN(parsedAmount) || parsedAmount < 100 || parsedAmount > 9999) {
    setMessage('Please enter a valid amount between ₹100 and ₹9999');
    return;
  }

  setMessage(''); // Clear any previous error
  const response = await createStripeSession(creatorId, parsedAmount);
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
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
                    disabled={isLoading || isProcessingPayment}
                    className={`bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors ${isLoading || isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {isLoading || isProcessingPayment ? 'Processing...' : 'Add'}
                  </button>
                </div>
              </div>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min={100}
                max={9999}
                className={`p-3 border ${message ? 'border-red-500' : 'border-gray-200'
                  } rounded-lg w-full focus:outline-none focus:ring-1 ${message ? 'focus:ring-red-500' : 'focus:ring-gray-400'
                  } transition-all`}
                disabled={isLoading || isProcessingPayment}
              />

              {/* Red error message */}
              {message && (
                <p className="mt-2 text-sm text-red-600 font-medium">{message}</p>
              )}
            </div>


            <div className="mb-6">
              <div className="inline-flex border border-gray-200 rounded-lg overflow-hidden">
                {['deduct', 'add', 'all'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter('deduct' as 'all' | 'add' | 'deduct')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${filter === type
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {type === 'deduct' ? 'Deducts' : type === 'add' ? 'Credited' : 'All'}
                  </button>
                ))}
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
                  {isLoading || isProcessingPayment ? (
                    <tr>
                      <td className="px-6 py-4 text-center text-gray-500" colSpan={3}>
                        Loading transactions...
                      </td>
                    </tr>
                  ) : paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((txn, index) => (
                      <tr
                        key={`txn-${index}-${txn.date}`}
                        className="bg-white hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">₹{txn.amount}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(txn.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${txn.type === 'add'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                              }`}
                          >
                            {txn.type === 'add' ? 'Credited' : 'Deduct'}
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
    </div>

  );
};

export default WalletComponent;