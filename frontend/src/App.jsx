import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom'
import UserLayout from './layout/UserLayout'


const queryClient = new QueryClient();
function App() {


  return (
<BrowserRouter>
<QueryClientProvider client={queryClient}>
<UserLayout/>
</QueryClientProvider>

</BrowserRouter>

  )
    
}

export default App
