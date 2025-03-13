// utils/setupInterceptors.js
import axios from 'axios';

export const setupAxiosInterceptors = () => {
  // Request interceptor for API calls
  axios.interceptors.request.use(
    config => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Adding token to request:', config.url);
      } else {
        console.log('No token available for request:', config.url);
      }
      
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
};
