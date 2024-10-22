import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";
import Spinner from "../Spinner/Spinner";
import MyModal from "../MyModal/MyModal";
import "../MyModal/MyModal.css";
import "./EditPassword.css";

const EditPassword = ({ passwordId, onClose }) => {
  const { verifyMasterPassword } = useAuth();
  const [passwordEntry, setPasswordEntry] = useState({
    username: "",
    url: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [enteredMasterPassword, setEnteredMasterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [directories, setDirectories] = useState([]);
  const [selectedDirectoryId, setSelectedDirectoryId] = useState("");
  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchPassword = async () => {
      setLoading(true);
      try {
        const passwordResponse = await axiosInstance.get(
          `/password-entries/${passwordId}`
        );
        setPasswordEntry({
          username: passwordResponse.data.username,
          url: passwordResponse.data.url,
        });
        setSelectedDirectoryId(passwordResponse.data.directoryId || "");

        const directoriesResponse = await axiosInstance.get(
          `/directories/user/${userId}`
        );
        setDirectories(directoriesResponse.data);
      } catch (error) {
        setError("Failed to fetch password details or directories.");
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPassword();
  }, [passwordId, userId]);

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
    if (!selectedDirectoryId) {
      setError('Please select a directory.');
      return;
    }
  
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
      }, {
        params: { directoryId: selectedDirectoryId }
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
        <div className="form-group">
          <select
            id="directory-select"
            value={selectedDirectoryId}
            onChange={(e) => {
              setSelectedDirectoryId(e.target.value);
              console.log("Directory changed to:", e.target.value);
            }}
          >
            <option value="">Choose a directory</option>
            {directories.map((directory) => (
              <option key={directory.id} value={directory.id}>
                {directory.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-signin" type="submit">
          Save Changes
        </button>
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
