import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/inviteFriend.css'
import tvGif from '../img/giphy.gif'
import Header from '../tsx/header'
import { useNavigate } from 'react-router-dom';
import triangle from '../img/pngwing.com.png'
import { Search } from '../../chat/tools/filterSearchSettings'

function InviteFriend(): JSX.Element {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');


    return (<div>
        <Header />
        <div className="mainDisplay">
            <a onClick={() => { navigate('/home') }} id="X" >X</a>
            <div className='IQ'>
                <div className="inviteFriendContainer">
                    <Search  />
                </div>
            </div>
        </div>
    </div>)
}

export default InviteFriend;