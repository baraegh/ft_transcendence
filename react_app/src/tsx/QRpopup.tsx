import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../css/QRpopup.css'

interface BlankModalProps {
  show: boolean;
  onHide: () => void;
}

const BlankModal: React.FC<BlankModalProps> = ({ show, onHide }) => {
  return (
    <Modal className="QRmodal" show={show} onHide={onHide} centered>
      <Modal.Body>
        <div className="QR">
          <p id="QrLabel"></p>
        </div>
        {/* Add your custom content here */}
        <input id="QRinput" type="text" placeholder="Your Code" />
      </Modal.Body>
    </Modal>
  );
};

const QRpopup: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowModal(event.target.checked);
  };

  return (
    <div>
      <label className="toggle-switch">
        <input type="checkbox" checked={showModal} onChange={handleToggleChange} />
        <span className="slider"></span>
        <p>2FA</p>
      </label>
      {showModal && <BlankModal show={showModal} onHide={() => setShowModal(false)} />}
    </div>
  );
};

export default QRpopup;
