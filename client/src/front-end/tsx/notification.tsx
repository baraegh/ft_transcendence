import React, { useState, useEffect } from "react";
import "../css/notification.css"; // CSS file for styling the notification
import me from "../img/rimney.jpeg";
import { socketInstance } from "/Users/rimney/Desktop/ft_transcendence/client/src/socket/socket.tsx";
const Notification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const socket = socketInstance;
  const challenge = () => {
    console.log("challenge");
    // const requestData = {
    //   challengerId: 99030, // User ID of barae
    //   login: "mohammed",
    // };
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
      player2Id: 90498,
      mode: { pColor: "WHITE", bColor: "GRAY", fColor: "BLACK", bMode: "" },
      name: "von",
      image: "image",
    };
    if (socket) {
      // let data = {
      //   userId: 99030, //barae
      //   cData: requestData,
      // };
      console.log("send from:" + socket);
      socket.emit("sendGameRequest", dataToSend);
    }
  };

  useEffect(() => {
    if (showNotification) {
      challenge();
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 30000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showNotification]);

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <>
      {showNotification && (
        <div className="slide-in-modal">
          <div className="content">
            <span className="message">
              rimney has sent you a friend request
            </span>
            {/* <button className="close-button" onClick={closeNotification}>
              X
            </button> */}
            <img id="profileImgNotif" src={me} alt="" />
          </div>
          <div className='notifButons'>
          <a onClick={() => {console.log("Accept Button")}}>Accept</a>
          <a onClick={() => {closeNotification()}}>Reject</a>
        </div>
        </div>
      )}
      <button onClick={() => setShowNotification(true)}>
        Show Notification
      </button>
    </>
  );
};

export default Notification;
