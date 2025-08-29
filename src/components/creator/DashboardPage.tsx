import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/creator/SideBar";
import { creatorService } from "../../services/creator/creatorService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import _ from "lodash";

interface TicketUser {
  name: string;
  email: string;
  eventName: string;
  amount: number;
  createdAt: string;
}

interface ChartData {
  date: string;
  [eventName: string]: string | number;
}

function DashBoard() {
  const [users, setUsers] = useState<TicketUser[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const usersPerPage = 4;
useEffect(() => {
  const creator = localStorage.getItem("creator");
  if (!creator) return;

  const creatorObj = JSON.parse(creator);
  const creatorId = creatorObj.id;

  creatorService
    .getTicketUsers(creatorId, currentPage, usersPerPage)
    .then((data) => {
      setUsers(data.users);
      setTotalPages(data.totalPages || 1);
    })
    .catch((err) => console.error(err.message));
}, [currentPage]);



  const daysRange = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i - 2); 
    return date.toISOString().split("T")[0]; 
  });

  const allEvents = Array.from(new Set(users.map((u) => u.eventName)));

  const grouped = _.groupBy(users, (u) =>
    new Date(u.createdAt).toISOString().split("T")[0]
  );

  const chartData: ChartData[] = daysRange.map((date) => {
    const data: ChartData = { date };
    allEvents.forEach((eventName) => {
      const dayRevenue = (grouped[date] || [])
        .filter((u) => u.eventName === eventName)
        .reduce((sum: number, u: TicketUser) => sum + u.amount, 0);
      data[eventName] = dayRevenue;
    });
    return data;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar />
      <main className="flex-1 flex flex-col p-6 sm:p-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">📈 Dashboard</h1>
        </header>

        {/* Summary Cards */}
        <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-sm text-gray-500 uppercase">Total Events</h2>
            <p className="mt-2 text-4xl font-bold text-indigo-600">
              {new Set(users.map((u) => u.eventName)).size}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-sm text-gray-500 uppercase">Total Revenue</h2>
            <p className="mt-2 text-4xl font-bold text-green-600">
              ₹{users.reduce((acc, u) => acc + u.amount, 0)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-sm text-gray-500 uppercase">Total Tickets</h2>
            <p className="mt-2 text-4xl font-bold text-blue-600">{users.length}</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Revenue Per Day / Event (5 Days)
          </h2>
          <div className="w-full h-80">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {allEvents.map((eventName, idx) => (
                    <Bar
                      key={eventName}
                      dataKey={eventName}
                      fill={["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][idx % 5]}
                      barSize={30}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>

            ) : (
              <div className="flex justify-center items-center h-full text-gray-400">
                No data available
              </div>
            )}
          </div>
        </section>

<section className="bg-white rounded-2xl mt-10 shadow-md overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-3 text-left font-semibold text-gray-600">User</th>
        <th className="px-6 py-3 text-left font-semibold text-gray-600">Email</th>
        <th className="px-6 py-3 text-left font-semibold text-gray-600">Event</th>
        <th className="px-6 py-3 text-right font-semibold text-gray-600">Date</th>
        <th className="px-6 py-3 text-right font-semibold text-gray-600">Amount</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 bg-white">
     {users.map((user, idx) => (
  <tr key={idx} className="hover:bg-gray-50">
    <td className="px-6 py-4 text-gray-900">{user.name}</td>
    <td className="px-6 py-4 text-gray-500">{user.email}</td>
    <td className="px-6 py-4 text-gray-500">{user.eventName}</td>
    <td className="px-6 py-4 text-right text-gray-600">
      {new Date(user.createdAt).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 text-right font-semibold text-gray-800">
      ₹{user.amount}
    </td>
  </tr>
))}

    </tbody>
  </table>

  <div className="flex justify-between items-center px-6 py-4 bg-gray-100 border-t">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
  >
    Prev
  </button>
  <span className="text-gray-700">
    Page {currentPage} of {totalPages}
  </span>
  <button
    onClick={() =>
      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
  >
    Next
  </button>
</div>

</section>

      </main>
    </div>
  );
}

export default DashBoard;
