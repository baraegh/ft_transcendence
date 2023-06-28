import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'
import '../css/2FA.css'
import me from '../img/rimney.jpeg'

function FA() : JSX.Element {
    return (

        <div className="mainDiv">
            <img src={me} className="UserImage" />
            <p className='userName'>rimney</p>
            <input placeholder='OTP' type="tel" className="otp" />
        </div>

    );
}

export default FA;