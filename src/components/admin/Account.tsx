import Sidebar from "../layout/admin/SideBar";
import { useEffect, useState } from "react";
import { fetchSubscriptionHistory } from "../../services/admin/adminService";


type SubscriptionHistory = {
  _id: string;
  creatorId: {
    name: string;
    email: string;
  };
  price: number;
  subscribedAt: string;
  status: string;
};

const AccountPage = () => {
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 5;


  const stats = {
    totalCreators: subscriptionHistory.length,
    totalPayments: subscriptionHistory.reduce((acc, curr) => acc + curr.price, 0),
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSubscriptionHistory(currentPage, limit);
        if (data.success) {
          setSubscriptionHistory(data.history);
          setTotalCount(data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching subscription history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);


  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      active: "bg-green-100 text-green-800",
      pending: "bg-gray-100 text-gray-800",
      cancelled: "bg-yello-100 text-yello-800",
      expired: "bg-red-100 text-red-600",
    };

    const statusColor = statusColors[status.toLowerCase()] || "bg-blue-100 text-blue-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 mt-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
          </header>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-100 rounded-xl p-6 shadow-md border border-green-100 overflow-hidden relative text-black">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-300 opacity-10 rounded-full -mr-6 -mt-6"></div>
                  <h2 className="text-sm font-medium mb-1">Total Subscriptions</h2>
                  <p className="text-3xl font-bold">{stats.totalCreators}</p>
                  <div className="mt-2 text-sm">Active creator subscriptions</div>
                </div>


                <div className="bg-green-100  rounded-xl p-6 shadow-md border border-green-100 overflow-hidden relative text-black">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-300 opacity-10 rounded-full -mr-6 -mt-6"></div>

                  <h2 className="text-sm font-medium mb-1">Total Revenue</h2>
                  <p className="text-3xl font-bold">₹{stats.totalPayments.toLocaleString()}</p>
                  <div className="mt-2 text-sm">All time earnings</div>
                </div>

                <div className="bg-purple-100 rounded-xl p-6 shadow-md border border-purple-100 overflow-hidden relative text-black">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-300 opacity-10 rounded-full -mr-6 -mt-6"></div>
                  <h2 className="text-sm font-medium mb-1">Avg. Subscription Value</h2>
                  <p className="text-3xl font-bold">
                    ₹{stats.totalCreators > 0
                      ? Math.round(stats.totalPayments / stats.totalCreators).toLocaleString()
                      : 0}
                  </p>
                  <div className="mt-2 text-sm">Per creator</div>
                </div>

              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">Subscription History</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subscriptionHistory.length > 0 ? (
                        subscriptionHistory.map((item, index) => (
                          <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(currentPage - 1) * limit + index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{item.creatorId?.name || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.creatorId?.email || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{item.price.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(item.subscribedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(item.status)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            No subscription history found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(totalCount / limit) }).map((_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;