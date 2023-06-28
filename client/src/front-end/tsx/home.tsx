import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './home.css'
import tvGif from './giphy.gif'
import MyHeader from './header'

function Home() : JSX.Element
{
    return (<div>
        <MyHeader/>
        <div className="mainDisplay">
            {/* <img  src={tvGif} alt="" /> */}
        </div>
        <div className="P_W" >
            <a id="Play" href="#"><span>Play</span></a>
            <a id="WatchStream" href="#"><span>Watch Stram</span></a>
        </div>
    </div>)
}

export default Home;