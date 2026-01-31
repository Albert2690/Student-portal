import React from 'react'
import UserRoutes from '../assets/routes/UserRoutes'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'

function UserLayout() {
  return (
    <>
    <Header/>
     <UserRoutes/>
     {/* <Footer/> */}
    </>
   
  )
}

export default UserLayout