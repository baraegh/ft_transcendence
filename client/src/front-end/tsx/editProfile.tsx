import React, { FormEvent, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../css/editProfile.css'
import Edit from '../img/edit.png'

interface BlankModalProps {
  show: boolean;
  onHide: () => void;
}

type profileType = {
  name:   string,
  image:  File | null,
}

const BlankModal: React.FC<BlankModalProps> = ({ show, onHide }) => {
  const [profileData, setProfileData] = useState<profileType>(
    {
      name:   '',
      image:  null
    }
  );

  const {name} = profileData; 

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value, type} = e.target;
  
      if (type === 'file') {
          const file = e.target.files && e.target.files[0];
          setProfileData({ ...profileData, [name]: file });
      }
      else
          setProfileData({ ...profileData, [name]: value });

  }
  
  const OnEdit = (event: FormEvent) => {
    event.preventDefault();
    console.log('profileData: ', profileData);

    // const formData = new FormData();

    // formData.append('type', GroupData.type);
    // formData.append('name', GroupData.name);
    // formData.append('hash', GroupData.hash)
    // formData.append('members', JSON.stringify(GroupData.members));
    // if (GroupData.image !== null)
    //     formData.append('image', GroupData.image);

    // try
    // {
    //     const response = await Axios.post("http://localhost:3000/chat/create-group", 
    //                         formData, 
    //                         { 
    //                             withCredentials: true,
    //                             headers: {
    //                                 'Content-Type': 'multipart/form-data',
    //                             }
    //                         });
    //     if (setChat)
    //         setChat(response.data.id, response.data.image? response.data.image :defaultGroupImage,
    //                 response.data.name, response.data.type, null);
    // }
    // catch(error)
    // {
    //     console.log(error);
  // }

  }

  return (
    <Modal className="editModal" show={show} onHide={onHide} centered>
      <Modal.Body>
        <div className="modalHeader">
          <p id='editModalTitle'> Edit Profile</p>
          <p onClick={onHide} id="closeButtonEditModal">x</p>
        </div>
        <div className='editHeaderLine'></div>
        <div className="editModalNamePic">
          <div className='editModalName'>
            <p id='editModalNameTitle'>Name</p>
            <input  id="editModalNameInput"
                    name='name'
                    type="text"
                    onChange={handleOnChange}
                    value={name}/>
          </div>
          <div className='editModalPic'>
            <p id='editModalPicTitle'>Choose Profile Picture</p>
            <input  id="editModalPicInput"
                    name='image'
                    type="file"
                    onChange={handleOnChange}
                    accept='.png, .jpg, .jpeg'/>
            <label htmlFor="editModalPicInput" className='browse-image-label'>Browse</label>
            {/* <Button id="editModalBrowse">Browse</Button> */}
          </div>
          
        </div>
        <div className='editModalFooter'>
          <Button onClick={onHide} id="Cancel" >Cancel</Button>      
          <Button id='Edit' type='submit' onClick={OnEdit}>Edit</Button>
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
