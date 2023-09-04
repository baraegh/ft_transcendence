// import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
// import { FormFloating } from "react-bootstrap";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../../socket/socketContext";
import "../css/maps.css";
import circle from "../img/circle.png";
// import Edit from "../img/edit.png";
import map1 from "../img/map1.png";
import map2 from "../img/map2.png";
import map3 from "../img/map3.png";
// import me from "../img/rimney.jpeg";
import square from "../img/square.png";
// import Notification from "./notification";

interface BlankModalProps {
  show: boolean;
  onHide: () => void;
}

const BlankModal: React.FC<BlankModalProps> = ({
  show,
  onHide,
  socket,
  userId,
}) => {
  const navigate = useNavigate();
  const [map, setMap] = useState<any[]>([                {
    pColor: "WHITE",
    bColor: "WHITE",
    fColor: "BLACK",
    bMode: "",
  },]);
  const [ball, setBall] = useState("1");
  useEffect(() => {
    // console.log('Map updated:', map);
    // console.log('Ball updated:', ball);
    // Perform any additional actions when map changes
  }, [map, ball]);

  const challenge = (socket: any, userId: string) => {
    type modeType = {
      pColor: string;
      bColor: string;
      fColor: string;
      bMode: string;
    };

    let dataToSend: {
      player2Id: number;
      mode: modeType;
      name: string;
      image: string;
    } = {
      player2Id: Number(userId),
      mode: {
        pColor: map[0].pColor,
        bColor: map[0].bColor,
        fColor: map[0].fColor,
        bMode: ball,
      },
      name: "von",
      image: "image",
    };

    if (socket && Number(userId) > 0) {
      console.log(">>>>>>send from:" + dataToSend.mode.fColor);
      socket.emit("sendGameRequest", dataToSend);
      navigate("/loadingPage");
    } else if (socket && Number(userId) === 0) {
      socket.emit("quick_game", dataToSend);
      navigate("/loadingPage");
    }
  };

  return (
    <Modal id="mapsPopup" show={show} onHide={onHide} centered>
      <Modal.Body>
        <div className="mapsHeader">Pick Your Map</div>
        <div className="maps">
          <div className="balls">
            <div
              className="smallBall"
              onClick={() => {
                setBall("1");
              }}
              style={{
                border: ball === "1" ? "1px solid white" : "",
                borderRadius: "60px",
              }}
            >
              <img src={circle} alt="" />
            </div>
            <div
              className="bigBall"
              onClick={() => {
                setBall("2");
              }}
              style={{
                border: ball === "2" ? "1px solid white" : "",
                borderRadius: "60px",
              }}
            >
              <img src={circle} alt="" />
            </div>
            <div
              className="blockBall"
              onClick={() => {
                setBall("3");
              }}
              style={{
                border: ball === "3" ? "1px solid white" : "",
                borderRadius: "60px",
              }}
            >
              <img src={square} alt="" />
            </div>
          </div>
          <div
            onClick={() =>
              setMap([
                {
                  pColor: "WHITE",
                  bColor: "WHITE",
                  fColor: "BLACK",
                  bMode: "",
                },
              ])
            }
            className="map"
            style={{
              backgroundImage: `url(${map1})`,
              border:
                map.length > 0 && map[0].fColor === "BLACK"
                  ? "6px solid red"
                  : "",
            }}
          ></div>
          <div
            onClick={() =>
              setMap([
                {
                  pColor: "BLACK",
                  bColor: "BLACK",
                  fColor: "WHITE",
                  bMode: "",
                },
              ])
            }
            className="map"
            style={{
              backgroundImage: `url(${map2})`,
              border:
                map.length > 0 && map[0].fColor === "WHITE"
                  ? "6px solid red"
                  : "",
            }}
          ></div>
          <div
            onClick={() =>
              setMap([
                { pColor: "BLACK", bColor: "WHITE", fColor: "GRAY", bMode: "" },
              ])
            }
            className="map"
            style={{
              backgroundImage: `url(${map3})`,
              border:
                map.length > 0 && map[0].fColor === "GRAY"
                  ? "6px solid red"
                  : "",
            }}
          ></div>
        </div>

        {/* Add your custom content here */}
        <a onClick={() => challenge(socket, userId)}>Launch Game</a>
      </Modal.Body>
    </Modal>
  );
};
const Maps: React.FC<{ buttonText: string, id : string }> = ({ buttonText, id }) => {
  const [showModal, setShowModal] = useState(false);
  const { socket } = useContext<any | undefined>(SocketContext);
  let { userId } = useParams();
  // if (userId === undefined) userId = "0";
  const handleImageClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <span onClick={handleImageClick}>{buttonText}</span>

      {showModal && (
        <BlankModal
          socket={socket}
          userId={id}
          show={showModal}
          onHide={handleCloseModal}
        />
      )}
    </>
  );
};

export default Maps;
