import axios from 'axios';
import { handleApiError } from './apiUtils';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const setupInterceptors = (navigate) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const csrfToken = Cookies.get('XSRF-TOKEN');
      const authToken = Cookies.get('authToken');

      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      } else {
        console.error('CSRF Token is missing');
      }

      if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
      } else {
        console.error('Auth Token is missing');
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const errorMessage = handleApiError(error);
      
      if(errorMessage === 'Invalid master password.'){
        console.error(errorMessage)
      } else if (error.response && error.response.status === 401) {
        Cookies.remove('authToken', { path: '/' });
        Cookies.remove('userId', { path: '/' });
        Cookies.remove('XSRF-TOKEN', { path: '/' });
        console.error(errorMessage);
        navigate('/');
      }

      return Promise.reject(error);
    }
  );
};

export { axiosInstance, setupInterceptors };
