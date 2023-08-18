import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/leaderBoard.css'
import me from '../img/rimney.jpeg'
import MyHeader from '../tsx/header'
import axios from 'axios'



function LeaderBoard(): JSX.Element {
    const [leaderboardData, setLeaderboardData] = useState([]);
  
    useEffect(() => {
      fetchLeaderboardData();
    }, []);
  
    async function fetchLeaderboardData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/leaderboard/leaderboard`, { withCredentials: true });
        const data = response.data;
  
        console.log(data);
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    }
  
    return (
      <div>
        <MyHeader />
        <div className='leaderBoard'>
          <p id="leaderBoardLabel">LeaderBoard</p>
          <p id="topPlayersLabel">TOP PLAYERS</p>
          {leaderboardData.map((item) => (
            <div className='firstRank' key={item.id}>
              <div className='rankNum'>
                <p>{item?.rank}</p>
              </div>
              <div className='fstLine'></div>
              <div className='score'>
                <p>{item?.score}</p>
              </div>
              <div className='scLine'></div>
              <div className='rankProfile'>
                <img src={item?.image} alt="" />
                <p>{item?.username}</p>
              </div>
              <div className='trLine'></div>
              <div className='gamesWon'>
                <p id='scoreNum'>{item?.gameWon}</p>
                <p id='scoreLabel'>Games won</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default LeaderBoard;
  