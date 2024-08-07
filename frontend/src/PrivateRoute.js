import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Spinner from './components/Spinner/Spinner';

const PrivateRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
