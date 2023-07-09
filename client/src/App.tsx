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
import "bootstrap/dist/css/bootstrap.css";
import FA from "./front-end/tsx/2FA";
import MyProfileUser from "./front-end/tsx/myProfileUser";
import myProfileUser from "./front-end/tsx/myProfileUser";
import AuthPage from "./auth/AuthPage";

import TwoFactorAuth from "./TwoFactorAuth/TwoFactorAuth";
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
  const [me, setMe] = useState<meType | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if the user is logged in based on the value in local storage
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    return storedLoggedIn ? JSON.parse(storedLoggedIn) : false;
  });

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
    <userMe.Provider value={me}>
      <Router>
        <Routes>
          <Route path="/" element={<DSTeam />}></Route>
          <Route
            path="/loginPage"
            element={
              !isLoggedIn ? <LoginPage /> : <Navigate to="/home" replace />
            }
          ></Route>
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate to="/loginPage" replace />}
          />
          <Route
            path="/TwoFactorAuth"
            element={
              isLoggedIn ? <Navigate to="/home" replace /> : <TwoFactorAuth />
            }
          />
          <Route
            path="/chat"
            element={isLoggedIn ? <Chat /> : <Navigate to="/loginPage" replace />}
          />
          <Route
            path="/leaderboard"
            element={
              isLoggedIn ? <LeaderBoard /> : <Navigate to="/loginPage" replace />
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <MyProfileUser />
              ) : (
                <Navigate to="/loginPage" replace />
              )
            }
          />
          {/* <Route path='/DSTeam' element={isLoggedIn ? <DSTeam /> : <Navigate to="/" replace />} /> */}
        </Routes>
      </Router>
      {/* // <LoginPage/> */}
    </userMe.Provider>
  );
}

export default App;
