import React from 'react'
import UserRoutes from '../assets/routes/UserRoutes'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import { useLocation } from 'react-router-dom'

function UserLayout() {

  const location = useLocation()


  return (
    <>
    {location.pathname !== '/login' && <Header />}
     <UserRoutes/>
     {/* <Footer/> */}
    </>
   
  )
}

export default UserLayout