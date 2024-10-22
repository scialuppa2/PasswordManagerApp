import React, { useState, useEffect, useCallback } from 'react';
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
  const [directories, setDirectories] = useState([]);
  const [selectedDirectoryId, setSelectedDirectoryId] = useState('');
  const { userId } = useAuth();

  const loadDirectories = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/directories/user/${userId}`);
      setDirectories(response.data);
    } catch (error) {
      console.error('Error loading directories:', error);
      alert(handleApiError(error));
    }
  }, [userId]);

  useEffect(() => {
    loadDirectories();
  }, [loadDirectories]);

  const handleAddPassword = async () => {
    if (!url || !username || !password) {
      alert('Error: Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(`/password-entries/user/${userId}`,
        {
          url,
          username,
          password,
        },
        {
          params: {
            directoryId: selectedDirectoryId,
          },
        }
      );
      

      if (response.status === 201) {
        alert('Success: Password added successfully');
        setUrl('');
        setUsername('');
        setPassword('');
        setSelectedDirectoryId(''); 
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
        <div className='form-group'>
          <select
            id="directory-select"
            value={selectedDirectoryId}
            onChange={(e) => setSelectedDirectoryId(e.target.value)}
          >
            <option value="">Choose a directory</option>
            {directories.map((directory) => (
              <option key={directory.id} value={directory.id}>
                {directory.name}
              </option>
            ))}
          </select>
        </div>
        <button className='btn btn-signin' type="submit" disabled={loading}>
          {loading ? <Spinner /> : 'Confirm'}
        </button>
      </form>
    </div>
  );
};

export default AddPassword;
