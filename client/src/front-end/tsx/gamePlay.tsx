import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/gamePlay.css'
import tvGif from '../img/giphy.gif'
import MyHeader from './header'
import { useNavigate } from 'react-router-dom';
import Game from '../../game/example'
import { getSocket, initializeSocket, socketInstance } from '../../socket/socket'
import axios from 'axios'

function gamePlay() : JSX.Element
{
    const navigate = useNavigate();
    const [logo, setLogo] = useState<string>(
      " https://imglarger.com/Images/before-after/ai-image-enlarger-1-after-2.jpg"
    );
    const socket = socketInstance;
    const [getid, setid] = useState<number | null>(null);
    const [login, setLogin] = useState<string>("Welcome to the Home Page!");
  
  
  
    useEffect(() => {
      const fetchdata = async () => {
        try {
          const response = await axios.get("http://localhost:3000/user/me", {
            withCredentials: true,
          });
          if (response.status === 200) {
            setLogo(response.data.image);
            setLogin("Welcome " + response.data.username);
            setid(response.data.id);
          } else {
            throw new Error("Request failed");
          }
        } catch (error) {
          console.log(error);
          navigate("/");
        }
      };
  
      fetchdata();
    }, []);
  
  
    useEffect(() => {
      if (getid !== null) {
        console.log(getid);
        initializeSocket(getid);
      }
      let socket:any;
      if(getid !== null) 
      {
         socket = getSocket();
  
      }
  
      if (socket) {
        socket.on("connect", () => {
          const requestData = {
            event: "userConnected",
            user: { id: getid },
          };
          socket.emit("requestData", requestData);
        });
        type modeType = {pColor: string, bColor: string, fColor:string, bMode:string};
        socket.on("gameRequestResponse",  (data: {player1Id: string, player2Id: string, mode: modeType, numplayer1Id: number, numplayer2Id: number}) =>{
          
          socket.emit('gameStart', data);
        });
  
        socket.on("FriendRequestResponse", (data: any) => {
          console.log("Received data from server:", data);
          // Perform actions with the received data
        });
  
        socket.on("chatToClient", (msg: any) => {
          console.log(msg);
        });
      }
  
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }, [getid]);
    return (
      <div>
        <MyHeader />
        <Game />
    </div>)
}

export default gamePlay;
