import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/home.css'
import tvGif from '../img/giphy.gif'
import MyHeader from './header'
import { useNavigate } from 'react-router-dom';
import Game from '../../game/example'

function Home() : JSX.Element
{
    return (<div>
        <MyHeader/>
            <Game />
        <div className="P_W" >
            <a id="Play" href="#"><span>Play</span></a>
            <a id="WatchStream" href="#"><span>Watch Stram</span></a>

        </div>  
    </div>)
}

export default Home;