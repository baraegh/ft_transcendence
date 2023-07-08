import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/gamePlay.css'
import tvGif from '../img/giphy.gif'
import MyHeader from './header'
import { useNavigate } from 'react-router-dom';
import Game from '../../game/example'

function gamePlay() : JSX.Element
{
    return (<div>
        <MyHeader/>
            <Game />
    </div>)
}

export default gamePlay;