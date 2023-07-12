import React, { useState, useEffect, useContext } from "react";
import "../css/notification.css"; // CSS file for styling the notification
import me from "../img/rimney.jpeg";
import { getSocket } from "../../socket/socket";
import SocketProvider, { SocketContext } from "../../socket/socketContext";
import { useParams } from "react-router-dom";
import { userMe } from "../../App";
import axios from "axios";

type meType = {
  id: number;
  username: string;
  image: string;
  gameWon: number;
  gameLost: number;
  achievements: string[];
};

const Notification: React.FC = () => {
  const { userId } = useParams();

  const { socket } = useContext<any | undefined>(SocketContext);

  const [me, setMe] = useState<meType | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/user/me", { withCredentials: true })
      .then((response) => {
        setMe(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (socket) {
      console.log("<< socket created successfully ! >> ");
      console.log(socket);
    }
  }, [socket]);

  type modeType = {
    pColor: string;
    bColor: string;
    fColor: string;
    bMode: string;
  };

  const [showNotification, setShowNotification] = useState(false);
  const [data, setData] = useState({
    player1Id: me?.id,
    player2Id: userId,
    mode: { pColor: "WHITE", bColor: "GRAY", fColor: "BLACK", bMode: "" },
  });

  const challenge = () => {
    let id: number = 0;
    if (userId) {
      id = parseInt(userId);
    }

    let dataToSend: {
      player2Id: number;
      mode: modeType;
      name: string;
      image: string;
    } = {
      player2Id: id,
      mode: { pColor: "WHITE", bColor: "GRAY", fColor: "BLACK", bMode: "" },
      name: "von",
      image: "image",
    };

    if (socket) {
      socket.on(
        "gameRequestResponse",
        (data: {
          player1Id: string;
          player2Id: string;
          mode: modeType;
          numplayer1Id: number;
          numplayer2Id: number;
        }) => {
          console.log("gameRequestResponse", data);
          setShowNotification(true);
          setData(data);
        }
      );
    }
  if (socket) {
      console.log(id);
      console.log(">>>>>>send from:" + socket);
      console.log(socket.id);
      socket.emit("sendGameRequest", dataToSend);
    }
  };


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
            <img id="profileImgNotif" src={me} alt="" />
          </div>
          <div className="notifButons">
            <a onClick={() => {socket?.emit('gameStart', data);console.log("accept")}}>Accept</a>
            <a onClick={() => {console.log("Reject Button")}}>Reject</a>
          </div>
        </div>
      )}
      <button onClick={challenge}>Show Notification</button>
    </>
  );
};

export default Notification;
