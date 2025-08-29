// src/routes/userRoute.tsx
import { Route, Routes } from "react-router-dom";
import Login from "../pages/creator/LoginPage";
import SignUp from "../pages/creator/SignUpPage";
import DashBoard from "../pages/creator/DashBoard";
import VerifyOtp from '../pages/creator/VerifyOtp';
import CreatorProfile from '../pages/creator/CreatorProfile';
import CreateAndManageEvents from "../components/creator/CreateAndManageEvents";
import CreateEventform from "../components/creator/CreateEventForm";
import EventProfile from "../components/creator/EventProfile";
import EventDetails from "../components/creator/EventDetails";
import Events from "../components/creator/Events";
import CreatorProtectedRoute from "./ProtectedRoute/CreatorProtectedRoute";
import ResetPassword from '../components/creator/ResetPassword'
import ForgotOtp from '../components/creator/ForgotPassword'
import AddPostForm from '../components/creator/AddPostForm'
import PostDetails from "../components/creator/PostDetails";
import PendingPage from "../components/creator/PendingPage";
import SubscriptionDetails from "../components/creator/SubscriptionDetails";
import SuccessPage from "../components/creator/Success";
import SubscriptionHistory from "../components/creator/SubscritionHistory";
import Messages from "../components/creator/Messages";
import CreatorChatPage from "../components/creator/CreatorChatPage";
import Account from "../components/creator/Account";
import WalletComponent from "../components/creator/Wallet";
import SeatLayout from "../components/creator/SeatLayout";
import Bookings from "../components/creator/Bookings";


const CreatorRoutes = () => {
  return (
    <Routes>


      <Route path="booking/:layoutId" element={<Bookings />} />
      <Route path="event/:id" element={<EventDetails />} />
      <Route path="seat-layout" element={<SeatLayout />} />
      <Route path="wallet" element={<WalletComponent />} />
      <Route path="account" element={<Account />} />
      <Route path="messages" element={<Messages />} />
      <Route path="chat/:userId" element={<CreatorChatPage />} />
      <Route path="subscription-history" element={<SubscriptionHistory />} />
      <Route path="success" element={<SuccessPage />} />
      <Route path="subscription-details" element={<SubscriptionDetails />} />
      <Route path="add-post-form" element={<AddPostForm />} />
      <Route path="post-details/:id" element={<PostDetails />} />
      <Route path="pending-page/:creatorId" element={<PendingPage />} />
      <Route element={<CreatorProtectedRoute />}>
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="profile" element={<CreatorProfile />} />
      </Route>

      <Route element={<CreatorProtectedRoute requireAuth={false} />}>
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>

      <Route path="verify-otp" element={<VerifyOtp />} />
      <Route path="create-and-manageEvents" element={<CreateAndManageEvents />} />
      <Route path="event-profile" element={<EventProfile />} />
      <Route path="create-event" element={<CreateEventform />} />
      <Route path="events" element={<Events />} />



      <Route path="forgot-password" element={<ForgotOtp />} />
      <Route path="reset-password" element={<ResetPassword />} />


    </Routes>
  );
};

export default CreatorRoutes;

