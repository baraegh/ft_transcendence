import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './QRpopup.css'



interface BlankModalProps {
  show: boolean;
  onHide: () => void;
}

const BlankModal: React.FC<BlankModalProps> = ({ show, onHide }) => {
  return (
    <Modal className="modal" show={show} onHide={onHide} centered>
      <Modal.Body>
        <div className="QR">
            <p id="QrLabel"></p>
        </div>
        {/* Add your custom content here */}
        <input id="QRinput" type="text" placeholder="Your Code"/>
      </Modal.Body>
    </Modal>
  );
};

const ParentComponent: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={handleShowModal}>Open Modal</button>

      <BlankModal show={showModal} onHide={handleCloseModal} />
    </div>
  );
};

export default ParentComponent;
