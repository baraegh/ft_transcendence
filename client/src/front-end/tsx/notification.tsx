import React, { useState, useEffect, useContext } from "react";
import "../css/notification.css"; // CSS file for styling the notification
import me from "../img/rimney.jpeg";
import { getSocket } from "../../socket/socket";
// import { Socket } from "socket.io-client";
import SocketProvider, { SocketContext } from "../../socket/socketContext";
import { useParams } from "react-router-dom";
import axios from "axios";


// import { socketInstance,getSocket } from "/Users/brmohamm/Desktop/ft_trance_keep_it_random/client/src/socket/socket.tsx";
const Notification: React.FC<{ buttonText: string, showNotification:boolean, setShowNotification: (arg0: boolean) => void, data: any, setData: (data: any) => void }> = ({ showNotification ,setShowNotification, buttonText, data, setData }) => {
  const { socket } = useContext<any | undefined>(SocketContext);
  const t : boolean = showNotification;
  const [img, setImg]  = useState("");
  const [name, setName] = useState("");
  console.log(data);
  console.log(data.numplayer1Id + " >>>>");
  const {userId} = useParams();
  useEffect(() => {
    if(data.numplayer1Id !== undefined)
    {
      const fetchAdditionalData = axios.get(`${import.meta.env.VITE_BACKEND_URL}/other-profile/about/${data.numplayer1Id}`, { withCredentials: true })
    .then(
      (res) => {
        setImg(res.data.image);
        setName(res.data.username);
        console.log(name);
        console.log(img);
      }
    )

    }
  }, [data]);

  type modeType = {pColor: string, bColor: string, fColor:string, bMode:string};
  const challenge = () => {

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
      image: "image"
    };
    if (socket) {
      
      console.log(">>>>>>send from:" + socket);
      console.log(socket.id);
      socket.emit("sendGameRequest", dataToSend);
      
    }
  };


  return (
    <>
      {showNotification && (
        <div className="slide-in-modal">
          <div className="content">
            <span className="message">
              {name} has sent you a friend request
            </span>

            <img id="profileImgNotif" src={img} alt="" />
          </div>
          <div className='notifButons'>
          <a onClick={() => {socket?.emit('gameStart', data);console.log("accept")}}>Accept</a>
          <a onClick={() => {setShowNotification(false)}}>Reject</a>
        </div>
        </div>
      )}
      <button onClick={() => challenge()}>
       {buttonText}
      </button>
    </>
  );
};

export default Notification;

