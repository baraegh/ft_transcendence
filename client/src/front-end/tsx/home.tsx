import { useEffect, useState } from "react";
import "../css/home.css";
import MyHeader from "./header";
import { useNavigate } from "react-router-dom";
import Game from "../../game/example";
import axios from "axios";
import  {socketInstance, initializeSocket, getSocket } from "/Users/brmohamm/Desktop/ft_trance_keep_it_random/client/src/socket/socket.tsx";
function Home(): JSX.Element {
  const socket = socketInstance;
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
      if (socket) {
        socket.emit('joinRoom', "1");
        console.log("join");
      }
    }
  return (
    <div>
      <MyHeader />
      
      <Game />
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
