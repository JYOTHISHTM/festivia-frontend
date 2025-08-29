
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../../redux/store";

interface CreatorProtectedRouteProps {
  requireAuth?: boolean;
}

const CreatorProtectedRoute: React.FC<CreatorProtectedRouteProps> = ({ requireAuth = true }) => {
  const isAuthenticated = useSelector((state: RootState) => state.creatorAuth.isAuthenticated);
  const location = useLocation();
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/creator/login" replace state={{ from: location }} />;
  }
  
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/creator/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default CreatorProtectedRoute;