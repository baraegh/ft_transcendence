import Bell from '../img/bell.png';
import '../css/header.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  image: string;
  gameWon: number;
  gameLost: number;
  achievements: string[];
}

function MyHeader(): JSX.Element {
  const [userData, setUserData] = useState<User | null>(null);
  const navigate = useNavigate();
  
  const fetchData = () => {
    axios
      .get('http://localhost:3000/user/me', { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;

          const fetchedUser: User = {
            id: data.id,
            username: data.username,
            image: data.image,
            gameWon: data.gameWon,
            gameLost: data.gameLost,
            achievements: data.achievements,
          };

          setUserData(fetchedUser); // Set the fetched user data
        } else {
          throw new Error('Request failed');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div>
      <header>
        <h3 onClick={() => navigate('/home')} className="logo">KIR</h3>
        <div className="vertical-line"></div>
        <div className="header_buttons">
          <a onClick={() => navigate('/leaderboard')} id="Lbutton" href="#">
            <span>LeaderBoard</span>
          </a>
          <a onClick={() => navigate('/chat')} id="Cbutton" href="#">
            <span>Chat</span>
          </a>
          <img className="bellImg" src={Bell} alt="" />
          <div className="profileImg">
            {userData && <img src={userData.image} alt="" />}
          </div>
        </div>
      </header>
    </div>
  );
}

export default MyHeader;
