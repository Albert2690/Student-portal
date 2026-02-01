import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedStudentRoutes = () => {
  const authFlag = localStorage.getItem("studentAuthFlag"); // Specific flag for students
  const role = localStorage.getItem("role"); // 'student'
  const location = useLocation();

  const isLoginPage = location.pathname === "/student/login";

  // If logged in as student and trying to access login, redirect to dashboard
  if (authFlag && role === 'student' && isLoginPage) {
    return <Navigate to="/student/dashboard" replace />;
  }

  // If not logged in and trying to access protected routes, redirect to login
  if ((!authFlag || role !== 'student') && !isLoginPage) {
    return <Navigate to="/student/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedStudentRoutes;
