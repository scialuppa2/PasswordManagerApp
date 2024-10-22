import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { axiosInstance } from "../../api/axiosConfig";
import MyNavbar from "../MyNavbar/MyNavbar";
import PasswordDirectory from "../PasswordList/PasswordDirectory";
import { FaFolderPlus } from "react-icons/fa6";
import Spinner from "../Spinner/Spinner";
import MyModal from "../MyModal/MyModal";
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [directories, setDirectories] = useState([]);
  const [newDirectoryName, setNewDirectoryName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const userId = Cookies.get("userId");
  const navigate = useNavigate();

  const handleDirectoryChange = (name) => {
    setNewDirectoryName(name);
  };

  const handleDirectoryClick = (directoryId) => {
    navigate(`/dashboard/directory/${directoryId}`);
  };

  const handleResetDirectory = () => {
    navigate("/dashboard/password-list");
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewDirectoryName("");
    setError(null);
  };

  const createDirectory = async () => {
    if (!newDirectoryName) {
      setError("Directory name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/directories/user/${userId}`, {
        name: newDirectoryName,
      });
      setDirectories([...directories, response.data]);
      closeModal();
      setNewDirectoryName("");
    } catch (err) {
      setError("Failed to create directory. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDirectories = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/directories/user/${userId}`);
        setDirectories(response.data);
      } catch (err) {
        setError("Failed to load directories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDirectories();
  }, [userId]);

  return (
    <div className="dashboard row">
      <div className="sidebar col-2">
        <button className="btn btn-signup" onClick={openModal}>
          <FaFolderPlus />
        </button>
        <button className="btn btn-signin" onClick={handleResetDirectory}>
          Show All
        </button>
        <PasswordDirectory
          directories={directories}
          onDirectoryClick={handleDirectoryClick}
        />
      </div>
      <div className="col-9">
        <MyNavbar />
        {loading && <Spinner />}
        {error && <div className="alert alert-danger">{error}</div>}
        <Outlet />
      </div>
      <MyModal
        showModal={showModal}
        handleClose={closeModal}
        title="Create New Directory"
        footer={
          <>
            <button className="btn btn-signin" onClick={createDirectory}>
              Create
            </button>
            <button className="btn btn-signup" onClick={closeModal}>
              Cancel
            </button>
          </>
        }
      >
        <input
          type="text"
          placeholder="New Directory Name"
          value={newDirectoryName}
          onChange={(e) => handleDirectoryChange(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
      </MyModal>
    </div>
  );
};

export default Dashboard;
