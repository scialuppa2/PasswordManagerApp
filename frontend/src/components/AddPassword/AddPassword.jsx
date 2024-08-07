import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../api/axiosConfig';
import { handleApiError } from '../../api/apiUtils';
import Spinner from '../Spinner/Spinner';
import './AddPassword.css';

const AddPassword = ({ onClose }) => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const handleAddPassword = async () => {
    if (!url || !username || !password) {
      alert('Error: Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(`/password-entries/user/${userId}`, {
        url,
        username,
        password
      });

      if (response.status === 201) {
        alert('Success: Password added successfully');
        setUrl('');
        setUsername('');
        setPassword('');
        onClose();
      } else {
        alert('Error: Failed to add password');
      }
    } catch (error) {
      console.error('Error adding password:', error);
      alert(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='add-form'>
      <h2>Add Password</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleAddPassword(); }}>
        <div style={{ marginBottom: '1em' }}>
          <input
            type="text"
            placeholder="Website"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '1em' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '1em' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className='btn btn-signin' type="submit" disabled={loading}>
          {loading ? <Spinner /> : 'Confirm'}
        </button>
      </form>
    </div>
  );
};

export default AddPassword;
