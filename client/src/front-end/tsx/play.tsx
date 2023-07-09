import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/play.css'
import tvGif from '../img/giphy.gif'
import Header from '../tsx/header'

function Play() : JSX.Element
{
    return (<div>
        <Header/>        
        <div className="mainDisplay">
            <a id="X" href="">X</a>
            <div className='IQ'>
            <a id='inviteFriend' href="">Invite Friend</a>
            <a id='quickGame' href="">Quick Game</a>
            {/* <img  src={tvGif} alt="" /> */}
            </div>
        </div>
    </div>)
}

export default Play;