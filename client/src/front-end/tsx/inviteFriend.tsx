import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/inviteFriend.css'
import tvGif from '../img/giphy.gif'
import Header from '../tsx/header'
import { useNavigate } from 'react-router-dom';
import triangle from '../img/pngwing.com.png'


function InviteFriend(): JSX.Element {
    const navigate = useNavigate();
    return (<div>
        <Header />
        <div className="mainDisplay">
            <a onClick={() => { navigate('/home') }} id="X" >X</a>
            <div className='IQ'>
                <div className="inviteFriendContainer">

                </div>
            </div>
        </div>
    </div>)
}

export default InviteFriend;