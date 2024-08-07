import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import MyModal from "../MyModal/MyModal";
import { axiosInstance } from '../../api/axiosConfig';
import './MyNavbar.css';

const MyNavbar = () => {
  const { username, userId, logout, toggleAuth } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newMasterPassword, setNewMasterPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleOpenUsernameModal = () => {
    setModalType('changeUsername');
    setShowModal(true);
  };

  const handleOpenPasswordModal = () => {
    setModalType('changeMasterPassword');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
    setNewUsername('');
    setNewMasterPassword('');
    setError(null);
    setSuccessMessage('');
  };

  const handleSubmit = async () => {
    try {
        if (modalType === 'changeUsername') {
            await axiosInstance.put(`/users/${userId}/username`, { username: newUsername });
            alert('Username changed successfully!');
            toggleAuth('login');
        } else if (modalType === 'changeMasterPassword') {
            await axiosInstance.put(`/users/${userId}/master-password`, { masterPassword: newMasterPassword });
            alert('Master password changed successfully!');
            toggleAuth('login');
        }

        handleCloseModal();
    } catch (error) {
        setError('Error changing information. Please try again.');
        console.error('API Error:', error);
    }
};



  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        
        <div className="ms-auto">
          <NavDropdown
            title={
              username ? (
                <span className="navbar-welcome">Ciao, {username}!</span>
              ) : (
                <span className="navbar-welcome">Benvenuto!</span>
              )
            }
            id="navbarScrollingDropdown"
          >
            <NavDropdown.Item onClick={handleOpenUsernameModal}>
              Change Username
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleOpenPasswordModal}>
              Change Master Password
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>
              Sign out <FontAwesomeIcon icon={faRightFromBracket} />
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </div>

      <MyModal
        showModal={showModal}
        handleClose={handleCloseModal}
        title={modalType === 'changeUsername' ? 'Change Username' : 'Change Master Password'}
        footer={
          <button className="btn btn-signin" onClick={handleSubmit}>
            Confirm
          </button>
        }
      >
        {modalType === 'changeUsername' && (
          <>
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </>
        )}
        {modalType === 'changeMasterPassword' && (
          <>
            <input
              type="password"
              placeholder="New Master Password"
              value={newMasterPassword}
              onChange={(e) => setNewMasterPassword(e.target.value)}
            />
          </>
        )}
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </MyModal>
    </nav>
  );
};

export default MyNavbar;
