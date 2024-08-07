import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { MdMovieFilter, MdOutlineDelete } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.min.css';
import './PasswordList.css';

const PasswordTable = ({ passwords, decryptedPasswords, shownPasswordId, handleShowPassword, handleEditClick, handleDeleteClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [localPasswords, setLocalPasswords] = useState(passwords);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setLocalPasswords(passwords); 
      setIsVisible(true);
    }, 50); 

    return () => clearTimeout(timer);
  }, [passwords]); 

  return (
    <div className={`row password-card ${isVisible ? 'visible' : 'hidden'}`}>
      {localPasswords.map((password) => (
        <div className="col-md-6 col-lg-4 col-xxl-3" key={password.id}>
          <div className="card my-3">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h4>{password.url}</h4>
                <hr />
                <p className="card-text">Username: {password.username}</p>
                <p className="card-text">
                  Password: {shownPasswordId === password.id ? decryptedPasswords[password.id] : '********'}
                  <button 
                    className="btn btn-eye ms-2" 
                    onClick={() => handleShowPassword(password.id)}
                  >
                    <FontAwesomeIcon icon={shownPasswordId === password.id ? faEyeSlash : faEye} />
                  </button>
                </p>
              </div>
              <div className="d-flex justify-content-around">
                <button className="btn btn-signup" onClick={() => handleEditClick(password)}>
                  <MdMovieFilter className='icon' /> Edit
                </button>
                <button className="btn btn-del" onClick={() => handleDeleteClick(password.id)}>
                  <MdOutlineDelete className='icon' />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PasswordTable;
