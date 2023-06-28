import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../css/editProfile.css'
import Edit from '../img/edit.png'

interface BlankModalProps {
  show: boolean;
  onHide: () => void;
}

const BlankModal: React.FC<BlankModalProps> = ({ show, onHide }) => {
  return (
    <Modal className="editModal" show={show} onHide={onHide} centered>
      <Modal.Body>
        <div className="modalHeader">
          <p id='editModalTitle'> Edit Profile</p>
          <p id="closeButtonEditModal">x</p>
        </div>
        <div className='editHeaderLine'></div>
        <div className="editModalNamePic">
          <div className='editModalName'>
            <p id='editModalNameTitle'>Name</p>
            <input id="editModalNameInput" type="text" />
          </div>
          <div className='editModalPic'>
            <p id='editModalPicTitle'>Choose Profile Picture</p>
            <input id="editModalPicInput" type="text" />
            <Button id="editModalBrowse"> </Button>
          </div>
          
        </div>
        <div className='editModalFooter'>
          <Button></Button>
          <Button></Button>
        </div>
        {/* Add your custom content here */}
      </Modal.Body>
    </Modal>
  );
};

const EditProfileIcon: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <img id="editIcon" src={Edit} alt="" onClick={handleImageClick} />

      {/* <img
        className="popup-image"
        src="your-image-url.jpg"
        alt="Popup Image"
        onClick={handleImageClick}
      /> */}
      {showModal && <BlankModal show={showModal} onHide={handleCloseModal} />}
    </div>
  );
};

export default EditProfileIcon;
