import axios from 'axios';

// ✅ Create a base instance
export const apiClient = axios.create({
  baseURL: 'https://student-portal-abzs.onrender.com',
   // your API base URL
  //  baseURL: 'http://localhost:7007', // your API base URL
  withCredentials: false, 
  timeout: 10000,
});

// ✅ Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token if stored locally (only if you use localStorage method)
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle errors before request is sent
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Return response normally
    return response;
  },
  (error) => {
    if (error.response) {
      // 🔹 Handle Unauthorized (token expired or invalid)
      if (error.response.status === 401) {
        console.warn('⚠️ Token expired or unauthorized. Logging out...');
        
        localStorage.removeItem('authFlag');
        localStorage.removeItem('token');
        window.location.href = '/login'; // redirect user
      }

      // 🔹 Optionally handle 403, 404, etc.
      else if (error.response.status === 403) {
        console.warn('Forbidden: You do not have access.');
      } else if (error.response.status === 404) {
        console.warn('Resource not found.');
      }
    } else {
      // Handle network errors
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);
