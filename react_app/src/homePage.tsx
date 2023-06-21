import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'
import './loginPage.css'

function LoginPage(): JSX.Element {
    return (<div>
        <header >
          <h3 className="logo">Keep It Random !</h3>
          <div  className=
          "discoverTeam">
            <h2 >Discover</h2>
            <h2 >Team</h2>
          </div>
          <div className="button_animation">
            <a href="#"><span>Play</span></a>
            </div>
        </header>
    </div>)
}
export default LoginPage;