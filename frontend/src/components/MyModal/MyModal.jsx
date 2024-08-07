import React from "react";
import { Modal } from "react-bootstrap";
import './MyModal.css';

const MyModal = ({ showModal, handleClose, title, children, footer }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
        <button className="btn btn-klose" onClick={handleClose}>X</button>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {footer || (
          <button className="btn btn-signup" onClick={handleClose}>
            Close
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;
