import React, { startTransition, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/stream.css'
import tvGif from '../img/giphy.gif'
import MyHeader from './header'
import { useNavigate } from 'react-router-dom';
import Game from '../../game/example'
import { SocketContext } from '../../socket/socketContext'
type Tstreaming = {roomName: string, client1Id: string, client2Id: string, player1Id: number, player2Id: number}
function Stream() : JSX.Element
{
    const { socket } = useContext<any | undefined>(SocketContext);
    console.log("IN");
    let fStreaming = new Map<number,Tstreaming>();
    socket?.emit('exploreRooms', "hello");// sending socket to server
    socket?.on('allRoomsData', (streaming: Tstreaming)=>{
        console.log(streaming);
    })
    socket?.emit('joinStreamRoom',fStreaming.get(0)?.roomName);
    socket?.emit('leaveStreamRoom',fStreaming.get(0)?.roomName);
    const navigate = useNavigate();
    return (
        <div>
          <MyHeader />
          <div className="mainDisplay">
            {Array.from(fStreaming).map(([key, value]) => {
              console.log(key + " << ");
              // Render components or values using key and value here
              return (
                <div key={key}>
                  {/* Render components or values using key and value here */}
                </div>
              );
            })}
          </div>
        </div>
      );
}

export default Stream;
