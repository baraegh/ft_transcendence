import React, { startTransition } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/stream.css'
import tvGif from '../img/giphy.gif'
import MyHeader from './header'
import { useNavigate } from 'react-router-dom';
import Game from '../../game/example'
import { socketInstance } from '../../socket/socket'
type streaming = {roomName: string, client1Id: string, client2Id: string, player1Id: number, player2Id: number};
function Home() : JSX.Element
{
    let fStreaming = new Map<number,streaming>();
    socketInstance?.emit('exploreRooms') // sending socket to server
    socketInstance?.on('allRoomsData', (streaming: Map<number,streaming>)=>{
        fStreaming = streaming;
    })
    socketInstance?.emit('joinStreamRoom',fStreaming.get(0)?.roomName);
    socketInstance?.emit('leaveStreamRoom',fStreaming.get(0)?.roomName);
    const navigate = useNavigate();
    return (<div>
        <MyHeader/>
        <div className="mainDisplay">

        </div>
    </div>)
}

export default Stream;
