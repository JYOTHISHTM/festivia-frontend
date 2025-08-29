

import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../../redux/store";

interface UserProtectedRouteProps {
  requireAuth?: boolean;
}

const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({ requireAuth = true }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const location = useLocation();
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/user/login" replace state={{ from: location }} />;
  }
  
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/user/home" replace />;
  }
  
  return <Outlet />;
};

export default UserProtectedRoute;