import React, { useState, useEffect } from "react";
import "../css/notification.css"; // CSS file for styling the notification
import me from "../img/rimney.jpeg";
import socket from './App'

// import { socketInstance,getSocket } from "/Users/brmohamm/Desktop/ft_trance_keep_it_random/client/src/socket/socket.tsx";
const Notification = () => {

  type modeType = {pColor: string, bColor: string, fColor:string, bMode:string};
  const [showNotification, setShowNotification] = useState(false);
  const [data, setData]  = useState({
    player1Id: "", player2Id: "", mode: {pColor: "WHITE", bColor: "GRAY", fColor: "BLACK", bMode: ""},
  });
  const challenge = () => {
    console.log("challenge");
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
      player2Id: 98782,
      mode: { pColor: "WHITE", bColor: "GRAY", fColor: "BLACK", bMode: "" },
      name: "von",
      image: "image"
    };
    if (socket) {
      
      console.log("send from:" + socket);
      socket.emit("sendGameRequest", dataToSend);
    }
  };
if(socket)
{
  socket.on("gameRequestResponse",  (data: {player1Id: string, player2Id: string, mode: modeType, numplayer1Id: number, numplayer2Id: number}) =>{
    console.log("gameRequestResponse" + data);
    setShowNotification(true);
    setData(data);
  });
}
    


  useEffect(() => {
    
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 10000);

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
          <a onClick={() => {socket?.emit('gameStart', data);console.log("accept")}}>Accept</a>
          <a onClick={() => {console.log("Reject Button")}}>Reject</a>
        </div>
        </div>
      )}
      <button onClick={() => challenge()}>
        Show Notification
      </button>
    </>
  );
};

export default Notification;
