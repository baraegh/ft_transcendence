import { useEffect, useState } from "react";
import "../css/home.css";
import MyHeader from "./header";
import { useNavigate } from "react-router-dom";
import Game from "../../game/example";
import axios from "axios";

import  {socketInstance, initializeSocket, getSocket } from  "../../socket/socket";
function Home(): JSX.Element {
  const socket = socketInstance;

  // if(socket )
  // {
  //   type modeType = {pColor: string, bColor: string, fColor:string, bMode:string};
  //   socket.on("gameRequestResponse",  (data: {player1Id: string, player2Id: string, mode: modeType, numplayer1Id: number, numplayer2Id: number}) =>{
      
  //     socket.emit('gameStart', data);
  //   });

  //   socket.on("FriendRequestResponse", (data: any) => {
  //     console.log("Received data from server:", data);
  //     // Perform actions with the received data
  //   });

  //   socket.on("chatToClient", (msg: any) => {
  //     console.log(msg);
  //   });
  // }
  const leaveroom = () =>{

    if (socket) {
      socket.emit('leaveRoom', '1');
      console.log("leaved");
      }
    }
    const sendingroup = () =>{
  
    if (socket) {
      socket.emit('chatToServer', { sender: "this.username", room: "1", message: "this.text" });
      console.log("send");
      }
    }
    const joiroom = () =>{
      console.log(socket);
      if (socket) {
        socket.emit('joinRoom', "1");
        console.log("join");
      }
    }
    const [isHeaderLoaded, setIsHeaderLoaded] = useState(false);

    useEffect(() => {
      // Simulating a delay for the header to load
      setTimeout(() => {
        setIsHeaderLoaded(true);
      }, 2000); // Adjust the delay time as needed
    }, [])
  return (
    <div>
        {isHeaderLoaded ? <MyHeader /> : null}
        {isHeaderLoaded ? <Game /> : null}
      <div className="P_W">
        <a id="Play" href="#">
          <span>Play</span>
        </a>
        <a id="WatchStream" href="#">
          <span>Watch Stram</span>
        </a>
        <button
        onClick={ joiroom}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        joiroom
      </button>

      <button
        onClick={ leaveroom}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        leaverrom
      </button>

      <button
        onClick={ sendingroup}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        sendingroup
      </button>
      </div>
    </div>
  );
}

export default Home;
