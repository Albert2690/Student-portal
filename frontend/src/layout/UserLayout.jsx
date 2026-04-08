import React from 'react'
import UserRoutes from '../assets/routes/UserRoutes'
import Header from '../components/header/Header'
import { useLocation } from 'react-router-dom'

function UserLayout() {
  const location = useLocation()

  const isLoginPage = location.pathname === '/login'

  if (isLoginPage) {
    return <UserRoutes />
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      <Header />
      <main className="flex-1 border-l border-gray-100 overflow-x-hidden overflow-y-auto bg-gray-50">
        <UserRoutes />
      </main>
    </div>
  )
}

export default UserLayout