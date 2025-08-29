
import { Route, Routes } from "react-router-dom";
import Login from "../pages/admin/LoginPage";
import DashBoard from "../pages/admin/DashBoard";
import EventManagement from "../pages/admin/EventManagement";
import CreatorManagement from "../pages/admin/CreatorManagement";
import UsersManagement from "../components/admin/UsersManagement";
import AdminProtectedRoute from "../routes/ProtectedRoute/AdminProtectedRoute";
import Approvals from "../components/admin/Approvals";
import Subscriptions from "../components/admin/Subscriptions";
import AccountPage from "../components/admin/Account";

const AdminRoutes = () => {
  return (
    <Routes>

      <Route path="account" element={<AccountPage />} />
      <Route path="approvals" element={<Approvals />} />
      <Route path="subscriptions" element={<Subscriptions />} />
      <Route element={<AdminProtectedRoute requireAuth={false} />}>
        <Route path="login" element={<Login />} />
      </Route>
      <Route element={<AdminProtectedRoute />}>
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="eventmanagement" element={<EventManagement />} />
        <Route path="creatormanagement" element={<CreatorManagement />} />
        <Route path="usersmanagement" element={<UsersManagement />} />
      </Route>




    </Routes>
  );
};

export default AdminRoutes;
