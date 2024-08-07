import React, { useState } from 'react';
import { axiosInstance } from '../../api/axiosConfig';
import { useForm } from 'react-hook-form';
import MyForm from '../MyForm/MyForm';

const Register = ({ toggleAuth }) => {
  const { handleSubmit, watch, register, formState: { errors, isValid } } = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',   
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateUsername = (username) => {
    if (/\s/.test(username)) {
      return 'Username should not contain spaces';
    }
    if (username.trim() === '') {
      return 'Username cannot be empty';
    }
    if (username.length < 3) {
      return 'Username should be at least 3 characters long';
    }
    return true;
  };

  const validatePassword = (password) => {
    const minLength = 8;
    if (/\s/.test(password)) {
      return 'Password should not contain spaces';
    }
    if (password.length < minLength) {
      return `Password should be at least ${minLength} characters long`;
    }
    return true;
  };

  const fields = [
    {
      name: 'username',
      type: 'text',
      placeholder: 'Username',
      validation: {
        required: 'Username is required',
        validate: validateUsername,
      },
    },
    {
      name: 'masterPassword',
      type: 'password',
      placeholder: 'Password',
      validation: {
        required: 'Password is required',
        validate: validatePassword,
      },
    },
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
      validation: {
        required: 'Confirm Password is required',
        validate: (value) => {
          const masterPassword = watch('masterPassword');
          return value === masterPassword || 'Passwords do not match';
        },
      },
    },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/users/register', {
        username: data.username,
        masterPassword: data.masterPassword,
      });

      alert('Success: Registration successful!');
      toggleAuth('login');
      return response.status === 200;
    } catch (error) {
      if (error.response) {
        console.error('Registration error:', error.response.data);
        setError(error.response.data.message || 'Registration failed');
      } else {
        console.error('Registration error:', error.message);
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container text-center vh-100">
      <h1>Sign Up</h1>
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
        <p>Already have an account?</p>
        <button className="btn btn-signin mt-3" onClick={() => toggleAuth('login')}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Register;
