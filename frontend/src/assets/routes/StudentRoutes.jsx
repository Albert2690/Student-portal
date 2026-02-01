import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentLogin from "../../pages/student/StudentLogin";
import StudentDashboard from "../../pages/student/StudentDashboard";
import StudentLayout from "../../layout/StudentLayout";

import ProtectedStudentRoutes from "./ProtectedStudentRoutes";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedStudentRoutes />}>
        <Route path="login" element={<StudentLogin />} />
        <Route path="/" element={<StudentDashboard />} />

        <Route element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}