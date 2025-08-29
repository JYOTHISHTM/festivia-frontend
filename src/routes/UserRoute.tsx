import { Route, Routes } from "react-router-dom";
import Login from "../pages/user/LoginPage";
import SignUp from "../pages/user/SignUpPage";
import HomePage from "../pages/user/HomePage";
// import LandingPage from "../components/layout/user/LandingPage";
import Profile from "../pages/user/ProfilePage";
import VerifyOtp from "../pages/user/verifyotp";
import EventDetails from "../pages/user/EventDetails";
import UserProtectedRoute from "../routes/ProtectedRoute/UserProtectedRoute";
import ResetPassword from '../components/user/ResetPassword'
import ForgotOtp from '../components/user/ForgotOtp'
import OAuthSuccessPage from '../components/user/OAuthSuccessPage'
import WalletComponent from "../components/user/Wallet";
import AllEvents from '../components/user/Events'
import ChangePassword from '../components/user/ChangePassword'
import Dummy from '../components/user/dummy'
import About from '../components/layout/user/About'
import PrivateEventCreators from "../components/user/PrivateEventCreators";
import SuccessPage from "../components/user/Success";
import CreatorsProfileDetails from "../components/user/CreatorsProfileDetails";
import PostDetailPage from "../components/user/PostDetailPage";
import UserChatPage from "../components/user/UserChatPage";
import Messages from "../components/user/Messages";
import MyTicketsPage from "../components/user/MyTicketsPage";
import Booking from "../components/user/Booking";

const UserRoutes = () => {

  return (

    <Routes>

      <Route path="chat/:creatorId" element={<UserChatPage />} />
      <Route path="messages" element={<Messages />} />

      <Route path="booking/:layoutId" element={<Booking />} />


      <Route path="success" element={<SuccessPage />} />
      <Route path="tickets" element={<MyTicketsPage />} />
      <Route path="creator-profiles-details/:id" element={<CreatorsProfileDetails />} />
      <Route path="all-private-creators-profiles" element={<PrivateEventCreators />} />
      <Route path="post-details-page/:id" element={<PostDetailPage />} />
      <Route path="verify-otp" element={<VerifyOtp />} />
      <Route path="dummy" element={<Dummy />} />
      <Route path="about" element={<About />} />

      <Route element={<UserProtectedRoute requireAuth={false} />}>
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        {/* <Route path="/" element={<LandingPage />} /> */}
      </Route>

      <Route element={<UserProtectedRoute />}>
        <Route path="event/:id" element={<EventDetails />} />
        <Route path="all-public-events" element={<AllEvents />} />
        <Route path="home" element={<HomePage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="wallet" element={<WalletComponent />} />
      </Route>


      <Route path="change-password" element={<ChangePassword />} />
      <Route path="/oauth-success" element={<OAuthSuccessPage />} />
      <Route path="forgot-password" element={<ForgotOtp />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Routes>

  );
};

export default UserRoutes;
