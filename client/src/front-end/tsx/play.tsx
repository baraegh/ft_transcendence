import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/play.css'
import tvGif from '../img/giphy.gif'
import Header from '../tsx/header'
import { useNavigate } from 'react-router-dom';
import triangle from '../img/pngwing.com.png'


function Play(): JSX.Element {
    const navigate = useNavigate();
    return (<div>
        <Header />
        <div className="mainDisplay">
            <a onClick={() => { navigate('/home') }} id="X" >X</a>
            <div className='IQ'>
                <div className="inviteFriendContainer">
                    <img id="triangleImg" src={triangle} alt="" />
                    <a id='inviteFriend' onClick={() => {navigate('/InviteFriend')}} >Invite Friend</a>
                </div>
                <div className="quickGameContainer">

                    <img id="triangleImg" src={triangle} alt="" />
                    <a id='quickGame' onClick={() => navigate('/gamePlay')} >Quick Game</a>
                </div>
            </div>
        </div>
    </div>)
}

export default Play;