


import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../../redux/store";

interface AdminProtectedRouteProps {
  requireAuth?: boolean;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ requireAuth = true }) => {
  const isAuthenticated = useSelector((state: RootState) => state.adminAuth.isAuthenticated);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setAuthChecked(true);
  }, [isAuthenticated]);

  if (!authChecked) return null;
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default AdminProtectedRoute;