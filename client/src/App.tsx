import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Chat from "./chat/chat";
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import LoginPage from "./front-end/tsx/loginPage";
import DSTeam from "../src/front-end/tsx/discoverTeam";
import Home from "./front-end/tsx/home";
import LeaderBoard from "./front-end/tsx/leaderBoard";
import MyHeader from "./front-end/tsx/header";
import 'bootstrap/dist/css/bootstrap.css'
import FA from './front-end/tsx/2FA'
import MyProfileUser from './front-end/tsx/myProfileUser';
import Play from './front-end/tsx/play'
import AuthPage from './auth/AuthPage'
import TwoFactorAuth from './TwoFactorAuth/TwoFactorAuth';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import SocketProvider from './socket/socketContext';

export {userMe}

type meType = {
  id:           number,
  username:     string,
  image:        string,
  gameWon:      number,
  gameLost:     number,
  achievements: string[],
}
const userMe = React.createContext<meType | null>(null);

//  let socket: Socket | null; 
//  export let socket: Socket | null = null;
function App() {
  const [me, setMe] = useState<meType | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if the user is logged in based on the value in local storage
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    return storedLoggedIn ? JSON.parse(storedLoggedIn) : false;
  });
  // useEffect(() => {
  //   const newSocket = io(`http://${window.location.hostname}:3000`);
  //   setSocket(newSocket);
  //   return () => newSocket.close();
  // }, [setSocket]);
  // useEffect(() => {
  //   // Initialize the socket when the component mounts
  //   const newSocket = io(`http://${window.location.hostname}:3000`);
  //   setSocket(newSocket); 
  //   return () => {
  //     newSocket.close();
  //   };
  // }, [setSocket]);

  useEffect(() => {
    Axios.get('http://localhost:3000/user/me', {withCredentials: true})
      .then((response) => {
        setMe(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  useEffect(() => {
    // const check = () => {
      Axios
        .get("http://localhost:3000/auth/check", { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            setIsLoggedIn(true);
          }
        });
    // };

    // checkLoggedInStatus();
  }, []);

  useEffect(() => {
    // Update local storage whenever the isLoggedIn state changes
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);
  
  return (
    <SocketProvider>
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
          </Routes>
        </Router>
      </userMe.Provider>
    </SocketProvider>
  );
}

export default App;
