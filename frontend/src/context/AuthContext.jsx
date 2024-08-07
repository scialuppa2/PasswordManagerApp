import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../api/axiosConfig';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    userId: null,
    username: null,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    const userId = Cookies.get('userId');
    const username = Cookies.get('username');
    const csrfToken = Cookies.get('XSRF-TOKEN');
    
    if (authToken && userId && csrfToken) {
      setAuth({ token: authToken, userId, username });
    } else {
      logout(); 
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (auth.token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
      const csrfToken = Cookies.get('XSRF-TOKEN');
      if (csrfToken) {
        axiosInstance.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
      }
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }, [auth.token]);

  const login = ({ token, userId, csrfToken, username }) => {
    setAuth({ token, userId, username });
    Cookies.set('authToken', token, { path: '/' });
    Cookies.set('userId', userId, { path: '/' });
    Cookies.set('XSRF-TOKEN', csrfToken, { path: '/' });
    Cookies.set('username', username, { path: '/' });
  };
  
  const logout = () => {
    setAuth({ token: null, userId: null, username: null });
    Cookies.remove('authToken', { path: '/' });
    Cookies.remove('userId', { path: '/' });
    Cookies.remove('XSRF-TOKEN', { path: '/' });
    Cookies.remove('username', { path: '/' });
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  const verifyMasterPassword = async (enteredMasterPassword) => {
    try {
      const response = await axiosInstance.post('/password-entries/verify-master-password', {
        userId: auth.userId,
        masterPassword: enteredMasterPassword,
      });
      return response.status === 200;
    } catch (error) {
      console.error('Failed to verify master password:', error.response ? error.response.data : error.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, verifyMasterPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
