import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import StudentHeader from '../components/header/StudentHeader';

export default function StudentLayout() {
  const authFlag = localStorage.getItem('studentAuthFlag');
  const role = localStorage.getItem('role');

  if (!authFlag || role !== 'student') {
     return <Navigate to="/student/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}