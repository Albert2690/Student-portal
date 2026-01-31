import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const authFlag = localStorage.getItem("authFlag");
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  // If the user is already logged in and goes to login/signup, redirect to home
  if (authFlag && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  // If the user is not logged in and tries to access any protected route
  if (!authFlag && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the route normally
  return <Outlet />;
};

export default ProtectedRoutes;
