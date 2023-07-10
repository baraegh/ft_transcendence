import React, { FormEvent, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../css/maps.css'
import Edit from '../img/edit.png'
import { FormFloating } from 'react-bootstrap';
import axios from 'axios';
import me from '../img/rimney.jpeg'
import square from '../img/square.png'
import circle from '../img/circle.png'

interface BlankModalProps {
    show: boolean;
    onHide: () => void;
}

type profileType = {
    name: string,
    image: File | null,
}

type ballType = 
{

}

const BlankModal: React.FC<BlankModalProps> = ({ show, onHide }) => {
    return (
        <Modal id="mapsPopup" show={show} onHide={onHide} centered>
            <Modal.Body  >
                <div className="mapsHeader">
                    Pick Your Map
                </div>
                <div className='maps'>
                    <div className='map'>
                        <div className='ballType'>
                            <div className='smallBall'>
                            <img src={circle} alt="" />
                            </div>
                            <div className='bigBall'>
                            <img src={circle} alt="" />
                            </div>
                            <div className='blockBall'>
                            <img src={square} alt="" />

                            </div>
                        </div>
                    </div>
                    <div className='map'>
                        <div className='ballType'>
                            <div className='smallBall'></div>
                            <div className='bigBall'></div>
                            <div className='blockBall'></div>
                        </div>

                    </div>
                    <div className='map'>
                        <div className='ballType'>
                            <div className='smallBall'>
                            </div>
                            <div className='bigBall'></div>
                            <div className='blockBall'></div>
                        </div>

                    </div>
                </div>

                {/* Add your custom content here */}
            <a >Launch Game</a>
            </Modal.Body>

        </Modal>
    );
};

const Maps: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const handleImageClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <a id='quickGame' onClick={handleImageClick}>Quick Game </a>

            {showModal && <BlankModal show={showModal} onHide={handleCloseModal} />}
        </div>
    );
};

export default Maps;
