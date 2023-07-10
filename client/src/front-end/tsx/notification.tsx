import React, { useState, useEffect, useContext } from "react";
import "../css/notification.css"; // CSS file for styling the notification
import me from "../img/rimney.jpeg";
import { getSocket } from "../../socket/socket";
// import { Socket } from "socket.io-client";
import SocketProvider, { SocketContext } from "../../socket/socketContext";


// import { socketInstance,getSocket } from "/Users/brmohamm/Desktop/ft_trance_keep_it_random/client/src/socket/socket.tsx";
const Notification : React.FC = () => {

  const { socket } = useContext<any | undefined>(SocketContext);

  useEffect(() => {
    // Use the socket instance here
    if (socket) {
      {
        console.log("CREATED >> ");
      console.log(socket);
      }
    }
  }, [socket]);

  
  
  type modeType = {pColor: string, bColor: string, fColor:string, bMode:string};
  const [showNotification, setShowNotification] = useState(false);
  const [data, setData]  = useState({
    player1Id: "", player2Id: "", mode: {pColor: "WHITE", bColor: "GRAY", fColor: "BLACK", bMode: ""},
  });
  const challenge = () => {

  // if (socket) {
  //   console.log("wwwwwaaaaaaa")
  //   socket.emit('connect01');
  // }
    // console.log(storedSocket);
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
      player2Id: 99030,
      mode: { pColor: "WHITE", bColor: "GRAY", fColor: "BLACK", bMode: "" },
      name: "von",
      image: "image"
    };
    if (socket) {
      
      console.log(">>>>>>send from:" + socket);
      console.log(socket.id);
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
      }, 30000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showNotification]);


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
