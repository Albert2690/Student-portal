import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../../pages/login/Login";
import StudentPage from "../../pages/studentPage/StudentPage";
import Dashboard from "../../pages/dashboard/Dashboard";
import StudentProfile from "../../pages/studentProfile/StudentProfile";
import CreateStudents from "../../pages/createstudent/CreateStudents";
import EditStudent from "../../pages/editStudent/EditStudent";
import ListCourses from "../../pages/courses/ListCourses";

import { CLIENTROUTES } from "../../../../backend/routes/clientRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import StudentFees from "../../pages/fees/StudentFees";
import Expenses from "../../pages/expense/Expenses";

import AttendanceList from "../../pages/attendance/AttendanceList";
import StaffsList from "../../pages/staffs/StaffsList";
import InvestmentList from "../../pages/investment/InvestmentList";

function UserRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path={CLIENTROUTES.LOGIN} element={<Login />} />
        <Route path={CLIENTROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={CLIENTROUTES.LIST_STUDENTS} element={<StudentPage />} />

        <Route path={CLIENTROUTES.STUDENT_PROFILE} element={<StudentProfile />} />
        <Route path={CLIENTROUTES.STUDENT_CREATE} element={<CreateStudents />} />
        <Route path={CLIENTROUTES.STUDENT_EDIT} element={<EditStudent />} />
        <Route path={CLIENTROUTES.COURSES} element={<ListCourses />} />
        <Route path={CLIENTROUTES.FEES} element={<StudentFees />} />
        <Route path={CLIENTROUTES.EXPENSES} element={<Expenses />} />

        <Route path={CLIENTROUTES.ATTENDANCE} element={<AttendanceList />} />
        <Route path={CLIENTROUTES.STAFFS} element={<StaffsList />} />
        <Route path={CLIENTROUTES.INVESTMENT} element={<InvestmentList />} />


      </Route>
    </Routes>
  );
}

export default UserRoutes;
