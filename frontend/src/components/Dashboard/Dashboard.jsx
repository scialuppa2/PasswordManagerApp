import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MyNavbar from '../MyNavbar/MyNavbar';
import PasswordList from '../PasswordList/PasswordList';
import Spinner from '../Spinner/Spinner';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="container">
      <MyNavbar />
      {loading && <Spinner />}
      {error && <div className="alert alert-danger">{error}</div>}
      <Routes>
        <Route path="/password-list" element={<PasswordList />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
