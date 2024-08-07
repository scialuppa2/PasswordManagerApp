import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { axiosInstance } from "../../api/axiosConfig";
import { useForm } from "react-hook-form";
import MyForm from "../MyForm/MyForm";
import { useNavigate } from "react-router-dom";

const Login = ({ toggleAuth }) => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const fields = [
    {
      name: 'username',
      type: 'text',
      placeholder: 'Username',
      validation: { required: 'Username is required' },
    },
    {
      name: 'masterPassword',
      type: 'password',
      placeholder: 'Password',
      validation: { required: 'Password is required' },
    },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/login", data);
      const { authToken, userId, csrfToken, username: user } = response.data;

      if (authToken && userId && csrfToken && user) {
        login({ token: authToken, userId, csrfToken, username: user });
        navigate("/dashboard/password-list");
      } else {
        console.error("Token or userId or username missing in response");
        setError("Unexpected error during login.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Login error:", error.response.data);
        setError(error.response.data.errorMessage || "Login failed");
      } else {
        console.error("Login error:", error.message);
        setError("Network error: Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container text-center vh-100">
      <h1>Sign In</h1>
      {error && <div className="alert">{error}</div>}
      <MyForm 
        fields={fields} 
        onSubmit={handleSubmit(onSubmit)}
        loading={loading} 
        register={register}
        errors={errors}
        isValid={isValid}
      />
      <div className="mt-3">
        <p>New to GuardianPass?</p>
        <button className="btn btn-signin mt-3" onClick={() => toggleAuth('register')}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
