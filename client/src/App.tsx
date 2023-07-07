import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Chat from './chat/chat';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import LoginPage from "./front-end/tsx/loginPage";
import DSTeam from '../src/front-end/tsx/discoverTeam'
import Home from './front-end/tsx/home'
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
// import HomePage from './home/HomePage'
import TwoFactorAuth from './TwoFactorAuth/TwoFactorAuth';
import axios from 'axios';
import { useEffect, useState } from 'react';




function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const check = () => {
      axios
        .get("http://localhost:3000/auth/check", { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            setIsLoggedIn(true);
          }
        })
    };
    check();
  }, []);

  return (

    <Router>
      <Routes >
        <Route  path="/" element={<DSTeam />}></Route>
        <Route  path="/loginPage" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/home" replace />}></Route>
        <Route path="/home" element={isLoggedIn ? < Home /> : <Navigate to="/loginPage" replace />} />
        <Route path="/TwoFactorAuth" element={isLoggedIn ? <Navigate to="/home" replace /> : <TwoFactorAuth /> } />
        <Route path="/chat" element={isLoggedIn ? <Chat /> : <Navigate to="/loginPage" replace />} />
        <Route path='/leaderboard' element={isLoggedIn ? <LeaderBoard/> : <Navigate to="/loginPage" replace />} />
        <Route path='/profile' element={isLoggedIn ? <MyProfileUser /> : <Navigate to="/loginPage" replace />} />
        {/* <Route path='/DSTeam' element={isLoggedIn ? <DSTeam /> : <Navigate to="/" replace />} /> */}
      </Routes>
    </Router>
    // <LoginPage/>
  );
}

export default App;