import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import tvGif from '../img/giphy.gif'
import Bell from '../img/bell.png'
import '../css/header.css'

function MyHeader() : JSX.Element
{
    return (<div>
        <header >
          <h3 className="logo">KIR</h3>
          <div className="vertical-line"></div>
          <div className="header_buttons">
            <a id="Lbutton" href="#"><span>LeaderBoard</span></a>
            <a id="Cbutton" href="#"><span>Chat</span></a>
            <img className="bellImg" src={Bell} alt="" />
            <div className="profileImg"> </div>
            </div>
        </header>
    </div>)
}

export default MyHeader;