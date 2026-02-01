import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom'
import UserLayout from './layout/UserLayout'


import { Routes, Route } from 'react-router-dom';
import StudentRoutes from './assets/routes/StudentRoutes';

const queryClient = new QueryClient();
function App() {

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/student/*" element={<StudentRoutes />} />
          <Route path="/*" element={<UserLayout />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
