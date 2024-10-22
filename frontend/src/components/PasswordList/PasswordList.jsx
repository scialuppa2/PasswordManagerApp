import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { axiosInstance } from "../../api/axiosConfig";
import Spinner from "../Spinner/Spinner";
import PasswordTable from "./PasswordTable";
import MyModal from "../MyModal/MyModal";
import AddPassword from "../AddPassword/AddPassword";
import EditPassword from "../EditPassword/EditPassword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../SearchBar/SearchBar";
import useDebounce from "../../useDebounce";
import { useParams } from "react-router-dom";
import "./PasswordList.css";

const PasswordList = () => {
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState(null);
  const [decryptedPasswords, setDecryptedPasswords] = useState({});
  const [shownPasswordId, setShownPasswordId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [enteredMasterPassword, setEnteredMasterPassword] = useState("");
  const [selectedPasswordId, setSelectedPasswordId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { userId, verifyMasterPassword } = useAuth();
  const { directoryId } = useParams();
  
  const fetchPasswords = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/password-entries/user/${userId}`,
        {
          params: {
            page,
            size,
            url: debouncedSearchTerm,
            directoryId: directoryId || null,
          },
        }
      );

      setPasswords(response.data.passwordEntries || []);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to fetch passwords.");
    } finally {
      setLoading(false);
    }
  }, [userId, page, debouncedSearchTerm, size, directoryId ]);

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(0);
  };

  const handleShowPassword = (id) => {
    setSelectedPasswordId(id);
    setModalContent("showPassword");
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setError(null);
    setEnteredMasterPassword("");
    setModalContent(null);
  };

  const handleDeleteClick = (id) => {
    setSelectedPasswordId(id);
    setModalContent("deletePassword");
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/password-entries/${selectedPasswordId}`);
      setPasswords((prev) =>
        prev.filter((password) => password.id !== selectedPasswordId)
      );
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      handleModalClose();
    } catch (error) {
      console.error("Failed to delete password:", error);
      setError("Failed to delete password.");
    }
  };

  const handleModalSubmit = async () => {
    const isVerified = await verifyMasterPassword(enteredMasterPassword);
    if (!isVerified) {
      setError("Invalid master password. Please try again.");
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/password-entries/${selectedPasswordId}/reveal`
      );
      setDecryptedPasswords((prev) => ({
        ...prev,
        [selectedPasswordId]: response.data,
      }));
      setShownPasswordId(selectedPasswordId);
      setTimeout(() => {
        setShownPasswordId(null);
        setDecryptedPasswords((prev) => ({
          ...prev,
          [selectedPasswordId]: "",
        }));
      }, 10000);
      handleModalClose();
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to fetch password.");
    }
  };

  const handleEditClick = (password) => {
    setSelectedPasswordId(password.id);
    setModalContent("editPassword");
    setShowModal(true);
  };

  const handleAddClick = () => {
    setModalContent("addPassword");
    setShowModal(true);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mt-3">
      <div className="filter-bar">
        <div>
          <button className="btn btn-signup" onClick={handleAddClick}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <SearchBar value={searchTerm} onSearch={handleSearch} />
      </div>
      {showSuccessMessage && (
        <p className="success-message">Password successfully deleted.</p>
      )}
      {error && <p className="error-message">{error}</p>}
      {passwords.length > 0 ? (
        <PasswordTable
          passwords={passwords}
          decryptedPasswords={decryptedPasswords}
          shownPasswordId={shownPasswordId}
          handleShowPassword={handleShowPassword}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      ) : (
        <p>No passwords found. You can add new passwords.</p>
      )}
      <div className="pagination align-items-center">
        <button
          className="btn btn-signin"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Prev
        </button>
        <span>
          {page + 1} of {totalPages}
        </span>
        <button
          className="btn btn-signin"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page + 1 === totalPages}
        >
          Next
        </button>
      </div>
      <MyModal
        showModal={showModal}
        handleClose={handleModalClose}
        title={
          modalContent === "addPassword"
            ? "Add Password"
            : modalContent === "editPassword"
            ? "Edit Password"
            : modalContent === "deletePassword"
            ? "Confirm Deletion?"
            : "Enter Master Password"
        }
        footer={
          modalContent === "showPassword" ||
          modalContent === "deletePassword" ? (
            <>
              {modalContent === "deletePassword" ? (
                <>
                  <button className="btn btn-del" onClick={handleDeleteConfirm}>
                    Confirm
                  </button>
                  <button className="btn btn-signin" onClick={handleModalClose}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-signin"
                    onClick={handleModalSubmit}
                  >
                    Confirm
                  </button>
                  <button className="btn btn-signup" onClick={handleModalClose}>
                    Cancel
                  </button>
                </>
              )}
            </>
          ) : null
        }
      >
        {modalContent === "addPassword" && (
          <AddPassword onClose={handleModalClose} />
        )}
        {modalContent === "editPassword" && (
          <EditPassword
            passwordId={selectedPasswordId}
            onClose={handleModalClose}
          />
        )}
        {modalContent === "showPassword" && (
          <>
            <p>Please enter your master password to reveal the password.</p>
            {error && <p className="error-message">{error}</p>}
            <input
              type="password"
              value={enteredMasterPassword}
              onChange={(e) => setEnteredMasterPassword(e.target.value)}
              placeholder="Master Password"
            />
          </>
        )}
      </MyModal>
    </div>
  );
};

export default PasswordList;
