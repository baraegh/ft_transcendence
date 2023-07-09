import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import React, { useContext, useEffect, useState, } from 'react';
import Chat from './chat/chat';
import LoginPage from "./front-end/tsx/loginPage";
import DSTeam from "../src/front-end/tsx/discoverTeam";
import Home from "./front-end/tsx/home";
import LeaderBoard from "./front-end/tsx/leaderBoard";
import MyHeader from "./front-end/tsx/header";
import 'bootstrap/dist/css/bootstrap.css';
import FA from './front-end/tsx/2FA';
import MyProfileUser from './front-end/tsx/myProfileUser';
import Play from './front-end/tsx/play';
import myProfileUser from './front-end/tsx/myProfileUser';
import AuthPage from './auth/AuthPage';
import GamePlay from './front-end/tsx/gamePlay';
import TwoFactorAuth from './TwoFactorAuth/TwoFactorAuth';
import axios from 'axios';
import ErrorPage from './front-end/tsx/ErrorPage';
import InviteFriend from './front-end/tsx/inviteFriend';
import Axios from 'axios';
export {userMe};

type meType = {
  id:           number,
  username:     string,
  image:        string,
  gameWon:      number,
  gameLost:     number,
  achievements: string[],
}
const userMe = React.createContext<meType | null>(null);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if the user is logged in based on the value in local storage
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    return storedLoggedIn ? JSON.parse(storedLoggedIn) : false;
  });

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/check", { withCredentials: true });
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        // Handle error
        console.error(error);
        setIsLoggedIn(false);
      }
    };

    checkLoggedInStatus();
  }, []);

  useEffect(() => {
    // Update local storage whenever the isLoggedIn state changes
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const [me, setMe] = useState<meType | null>(null)

  useEffect(() => {
    Axios.get('http://localhost:3000/user/me', {withCredentials: true})
      .then((response) => {
        setMe(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);


  return (
    <userMe.Provider value={me}>
      <Router>
        <Routes>
          <Route path="/" element={<DSTeam />} />
          <Route
            path="/loginPage"
            element={!isLoggedIn ? <LoginPage /> : <Navigate to="/home" replace />}
          />
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate to="/loginPage" replace />}
          />
          <Route
            path="/play"
            element={isLoggedIn ? <Play /> : <Navigate to="/loginPage" replace />}
          />
          <Route
            path="/TwoFactorAuth"
            element={isLoggedIn ? <Navigate to="/home" replace /> : <TwoFactorAuth />}
          />
          <Route
            path="/chat"
            element={isLoggedIn ? <Chat /> : <Navigate to="/loginPage" replace />}
          />
          <Route
            path="/leaderboard"
            element={isLoggedIn ? <LeaderBoard /> : <Navigate to="/loginPage" replace />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <MyProfileUser /> : <Navigate to="/loginPage" replace />}
          />
          <Route
            path="/gamePlay"
            element={isLoggedIn ? <GamePlay /> : <Navigate to="/loginPage" replace />}
          />
          <Route
            path="/inviteFriend"
            element={isLoggedIn ? <InviteFriend /> : <Navigate to="/loginPage" replace />}
          />
          <Route
            path="/errorPage"
            element={<ErrorPage />}
          />
        </Routes>
      </Router>
      </userMe.Provider>
  );
}

export default App;
