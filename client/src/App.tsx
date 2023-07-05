import './App.css';
import React, { useEffect, useState, } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from './chat/chat';
import AuthPage from './auth/AuthPage';
import HomePage from './home/HomePage';
import TwoFactorAuth from './TwoFactorAuth/TwoFactorAuth';
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
        <Routes >
          <Route  path="/" element={<AuthPage />} />
          <Route  path="/TwoFactorAuth" element={<TwoFactorAuth />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </userMe.Provider>
  );
}

export default App;