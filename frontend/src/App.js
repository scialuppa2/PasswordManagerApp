import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setupInterceptors } from './api/axiosConfig';
import { AuthProvider } from "./context/AuthContext";
import { ErrorProvider } from "./components/Error/ErrorContext";
import Home from "./components/Home/Home";
import MyFooter from "./components/MyFooter/MyFooter";
import Dashboard from "./components/Dashboard/Dashboard";
import ErrorMessage from "./components/Error/ErrorMessage";
import NotFound from "./components/NotFound/NotFound";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  setupInterceptors();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark' : 'light';
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => {
      const newTheme = !prevTheme;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  return (
    <Router>
      <AuthProvider>
        <ErrorProvider>
          <ErrorMessage />
          <Routes>
            <Route path="/" element={<Home toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />} />
            <Route path="/dashboard/*" element={<PrivateRoute />}>
              <Route path="*" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MyFooter />
        </ErrorProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
