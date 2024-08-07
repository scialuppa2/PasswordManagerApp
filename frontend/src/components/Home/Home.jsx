import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import Login from "../Login/Login";
import Register from "../Register/Register";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { FaBackward } from "react-icons/fa";

function Home({ toggleTheme, isDarkTheme }) {
  const [authMode, setAuthMode] = useState(null);

  const handleAuthModeChange = (mode) => {
    setAuthMode(mode);
  };

  const handleBack = () => {
    setAuthMode(null);
  };

  return (
    <div className="home-container">
      <div className="left-bar"></div>
      <div className="right-bar">
        <button className="btn btn-signup" onClick={toggleTheme}>
          {isDarkTheme ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
        </button>
        {authMode === null ? (
          <>
            <h1>Welcome to GuardianPass</h1>
            <p className="mt-3">
              Manage your passwords securely and conveniently.
              <br />
              Sign in or create an account to get started.
            </p>
            <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-signin mx-2" onClick={() => handleAuthModeChange("login")}>
                Sign In
              </button>
              <button className="btn btn-signup mx-2" onClick={() => handleAuthModeChange("register")}>
                Sign Up
              </button>
            </div>
          </>
        ) : authMode === "login" ? (
          <>
            <button className="btn btn-back" onClick={handleBack}>
            <FaBackward />
            </button>
            <Login toggleAuth={handleAuthModeChange} />
          </>
        ) : (
          <>
            <button className="btn btn-back" onClick={handleBack}>
            <FaBackward />
            </button>
            <Register toggleAuth={handleAuthModeChange} />
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
