import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../Spinner/Spinner';
import MyModal from '../MyModal/MyModal';
import '../MyModal/MyModal.css';
import './EditPassword.css';

const EditPassword = ({ passwordId, onClose }) => {
  const { verifyMasterPassword } = useAuth();
  const [passwordEntry, setPasswordEntry] = useState({
    username: '',
    url: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [enteredMasterPassword, setEnteredMasterPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPassword = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/password-entries/${passwordId}`);
        setPasswordEntry({
          username: response.data.username,
          url: response.data.url,
        });
      } catch (error) {
        setError('Failed to fetch password details.');
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPassword();
  }, [passwordId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    const isVerified = await verifyMasterPassword(enteredMasterPassword);
    if (!isVerified) {
      setError('Invalid master password.');
      setEnteredMasterPassword('');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(`/password-entries/${passwordId}`, {
        ...passwordEntry,
        password: newPassword || undefined,
      });
      onClose();
    } catch (error) {
      setError('Failed to update password.');
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="add-form">
      {loading && <Spinner />}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="url"
            placeholder="Website"
            value={passwordEntry.url}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={passwordEntry.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="New Password (leave empty if not changing)"
            value={newPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <button className='btn btn-signin' type="submit">Save Changes</button>
        {error && <p className="error">{error}</p>}
      </form>

      <MyModal
        showModal={showModal}
        handleClose={handleModalClose}
        title="Verify Master Password"
      >
        <p>Please enter your master password to confirm changes.</p>
        {error && <p className="error-message">{error}</p>}
        <input
          type="password"
          value={enteredMasterPassword}
          onChange={(e) => setEnteredMasterPassword(e.target.value)}
          placeholder="Master Password"
        />
        <button className="btn btn-signin" onClick={handleModalSubmit}>
          Confirm
        </button>
      </MyModal>
    </div>
  );
};

export default EditPassword;
