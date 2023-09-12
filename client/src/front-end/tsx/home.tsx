import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/home.css'
import tvGif from '../img/giphy.gif'
import MyHeader from './header'
import { useNavigate } from 'react-router-dom';
import Game from '../../game/example'
import axios from 'axios'
import { SocketContext } from '../../socket/socketContext'
import Maps from './maps'
function Home() : JSX.Element
{
    const [isHeaderLoaded, setIsHeaderLoaded] = useState(false);
    const { socket } = useContext<any | undefined>(SocketContext);


    // useEffect(() => {
    //   document.location.reload();
    // }, [])
    const navigate = useNavigate();
    return (<div>
        <MyHeader/>
        <div className="mainDisplay">
            <img  id="tvGif" src={tvGif} alt="" />
        </div>
        <div className="P_W" >
            <a id="Play" onClick={() => {navigate('/Play')}}><span>Play</span></a>
            <a id="WatchStream" onClick={() => {navigate('/stream')}} href="#"><span>Watch Stram</span></a>
        </div>
    </div>)
}

export default Home;
