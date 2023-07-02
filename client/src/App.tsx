import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from './chat/chat';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import LoginPage from "./front-end/tsx/loginPage";
import DSTeam from '../src/front-end/tsx/discoverTeam'
// import Home from './tsx/home'
import LeaderBoard from './front-end/tsx/leaderBoard';
import MyHeader from "./front-end/tsx/header";
// import './front-end/css/.css'
import 'bootstrap/dist/css/bootstrap.css'
import FA from './front-end/tsx/2FA'
import MyProfileUser from './front-end/tsx/myProfileUser';
// import OtherProfileUser from "./tsx/otherProfileUser";
// import LeaderBoard from './tsx/leaderBoard';
// import Play from './tsx/play'
// import QRpopup from './tsx/QRpopup'
import myProfileUser from './front-end/tsx/myProfileUser';
import AuthPage from './auth/AuthPage'
import HomePage from './home/HomePage'




function App() {

  return (

    <Router>
      <Routes >
        <Route  path="/" element={<LoginPage />} />
        <Route path="/home" element={<MyProfileUser />} />
        <Route path="/chat" element={<Chat />} />
        < Route path='/leaderboard' element={<LeaderBoard/>} />
      </Routes>
    </Router>
    // <LoginPage/>
  );
}

export default App;