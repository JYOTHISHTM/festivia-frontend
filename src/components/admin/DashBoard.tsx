import { useEffect, useState } from 'react';
import Navbar from '../layout/admin/SideBar';
import {
  getDashboardData,
  getSubscriptionHistory,
} from "../../services/admin/adminService";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";

type SubscriptionHistory = {
  _id: string;
  creatorId: { name: string; email: string };
  price: number;
  status: string;
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const AdminDashboard = () => {
  const [data, setData] = useState({
    userCount: 0,
    creatorCount: 0,
    pendingApprovals: 0,
    totalEarnings: 0,
  });

  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getSubscriptionHistory();
        if (response.success) {
          const active = response.history.filter(
            (sub: SubscriptionHistory) => sub.status.toLowerCase() === "active"
          );
          const total = active.reduce((sum: number, sub: SubscriptionHistory) => sum + sub.price, 0);
          setTotalRevenue(total);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDashboard();
  }, []);

  const distributionData = [
    { name: 'Users', value: data.userCount },
    { name: 'Creators', value: data.creatorCount },
    { name: 'Pending', value: data.pendingApprovals },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10  mx-auto">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 mt-10">Admin Dashboard</h1>



      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { title: "Total Users", value: data.userCount, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Total Creators", value: data.creatorCount, color: "text-green-600", bg: "bg-green-100" },
          { title: "Pending Approvals", value: data.pendingApprovals, color: "text-yellow-600", bg: "bg-yellow-100" },
          { title: "Total Earnings", value: `₹${totalRevenue.toLocaleString()}`, color: "text-purple-600", bg: "bg-purple-100" },
        ].map((card, i) => (
          <div key={i} className={`rounded-xl shadow-sm p-5 ${card.bg}`}>
            <h2 className="text-md font-medium text-gray-600">{card.title}</h2>
            <p className={`text-3xl font-bold mt-2 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Metrics Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Users", value: data.userCount },
                { name: "Creators", value: data.creatorCount },
                { name: "Pending", value: data.pendingApprovals },
                { name: "Earnings (×100)", value: Math.round(totalRevenue / 100) },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">User Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >

                {distributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}


              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
