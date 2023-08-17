import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/leaderBoard.css'
import me from '../img/rimney.jpeg'
import MyHeader from '../tsx/header'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



function AlreadyInGame(): JSX.Element {
  const navigate = useNavigate();
  axios.get('http://localhost:3000/game/isplaying', {withCredentials: true})
  .then((res) => {res.data === false ? navigate('/play') : ""})
  
    return (
      <div>
        <MyHeader />
        <div className='leaderBoard'>
            <p id="oops_currentGame">Oops ! Souds Like You're Already Having A Current Game Running !</p>
        </div>
      </div>
    );
  }
  
  export default AlreadyInGame;
  