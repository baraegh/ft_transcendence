import React from 'react';
import './App.css';
import Chat from './chat/chat';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import LoginPage from "./front-end/tsx/loginPage";
// import FA from './tsx/2FA'
// import DSTeam from './tsx/discoverTeam'
// import Home from './tsx/home'
import MyHeader from "./front-end/tsx/header";
// import './front-end/css/.css'
import 'bootstrap/dist/css/bootstrap.css'
import FA from './front-end/tsx/2FA'
import MyProfileUser from './front-end/tsx/myProfileUser';
// import OtherProfileUser from "./tsx/otherProfileUser";
// import LeaderBoard from './tsx/leaderBoard';
// import Play from './tsx/play'
// import QRpopup from './tsx/QRpopup'




function App() {

  return (
    // <Router>
    // <Routes >
    //   <Route  path="/" element={<AuthPage />} />
    //   <Route path="/home" element={<HomePage />} />
    //   <Route path="/chat" element={<Chat />} />
    // </Routes>
    // </Router>
    <div className='App'>
      <MyProfileUser />
      {/* <FA></FA> */}
        {/* <Chat /> */}
    </div>
  )
}

export default App
