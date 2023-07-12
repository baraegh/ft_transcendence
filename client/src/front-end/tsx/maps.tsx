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

const maps = {
  Maptype: 0,
  BallType: ""
};

const BlankModal: React.FC<BlankModalProps> = ({ show, onHide }) => {
  const [Maps, setMaps] = useState(maps);

  useEffect(() => {
    console.log("Maps updated:", Maps);
    // Perform any additional actions when Maps changes
  }, [Maps]);

  const SetMapType = (mapType: number, ballType: string) => {
    setMaps(prevMaps => ({
      ...prevMaps,
      Maptype: mapType,
      BallType: ballType
    }));
  };

  return (
    <Modal id="mapsPopup" show={show} onHide={onHide} centered>
      <Modal.Body>
        <div className="mapsHeader">Pick Your Map</div>
        <div className="maps">
          <div
            onClick={() => SetMapType(1, "example ball type")}
            className="map"
            style={{ border: Maps.Maptype === 1 ? "6px solid red" : "" }}
          >
            <div className="ballType">
              <div className="smallBall">
                <img src={circle} alt="" />
              </div>
              <div className="bigBall">
                <img src={circle} alt="" />
              </div>
              <div className="blockBall">
                <img src={square} alt="" />
              </div>
            </div>
            <p id="map1">map 1</p>
          </div>
          <div
            onClick={() => SetMapType(2, "")}
            className="map"
            style={{ border: Maps.Maptype === 2 ? "6px solid red" : "" }}
          >
            <div  className="ballType">
              <div onClick={() =>  SetMapType(2, "smallball")}
              className="smallBall"
              style={{ border: Maps.BallType === "smallBall" ? "6px solid red" : "" }}
              >
              
                <img src={circle} alt="" />
              </div>
              <div className="bigBall">
                <img src={circle} alt="" />
              </div>
              <div className="blockBall">
                <img src={square} alt="" />
              </div>
            </div>
            <p id="map2">map 2</p>
          </div>
          <div
            onClick={() => SetMapType(3, "example ball type")}
            className="map"
            style={{ border: Maps.Maptype === 3 ? "6px solid red" : "" }}
          >            <div className="ballType">
              <div className="smallBall">
                <img src={circle} alt="" />
              </div>
              <div className="bigBall">
                <img src={circle} alt="" />
              </div>
              <div className="blockBall">
                <img src={square} alt="" />
              </div>
            </div>
            <p id="map3">map 3</p>
          </div>
        </div>

        {/* Add your custom content here */}
        <a>Launch Game</a>
      </Modal.Body>
    </Modal>
  );
};

const Maps: React.FC<{ buttonText: string }> = ({ buttonText }) => {
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <a onClick={handleImageClick}>{buttonText}</a>

      {showModal && <BlankModal show={showModal} onHide={handleCloseModal} />}
    </div>
  );
};

export default Maps;
