import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/myProfileUser.css';

import me from '../img/rimney.jpeg';
import ach from '../img/42_logo.png';
import MyHeader from '../tsx/header';
import QRpopup from '../tsx/QRpopup'
import Edit from '../img/edit.png'
import EditProfileIcon from '../tsx/editProfile'
import axios from 'axios';
import nextButton from '../img/next.png'
import nextButtonGray from '../img/nextGray.png'

import backButton from '../img/back.png'
import backButtonGray from '../img/backGray.png'


import bronze from '../img/bronze.png'
import silver from '../img/silver.png'
import gold from '../img/gold.png'

interface User {
  id: number;
  username: string;
  image: string;
  gameWon: number;
  gameLost: number;
  achievements: string[];
}

interface Friend {
  id: number,
  username: string;
  image: string;
}

interface Friends extends Array<{
  blocked: boolean;
  isRequested: boolean;
  isFriend: boolean;
  requestAccepted: boolean;
  friend: Friend;
}> { }

interface Match {
  matchId: string;
  otherUser: {
    id: number;
    image: string;
    username: string;
  };
  win: boolean;
  user1P: number;
  user2P: number;
}

interface OtherUser {
  id: number;
  image: string;
  username: string;
}

function MyProfileUser(): JSX.Element {
  const switchScrollFlag = () => {
    setScrollFlag(!scrollFlag);
  };

  const generateRandomUser = (index: number): OtherUser => {
    const randomId = Math.floor(Math.random() * 1000);
    const randomImage = 'https://random.imagecdn.app/500/150';
    const randomUsername = `Other ${index}`;
    return { id: randomId, image: randomImage, username: randomUsername };
  };

  const matches: Match[] = [];

  for (let i = 0; i < 64; i++) {
    const match: Match = {
      matchId: `match${i}`,
      otherUser: generateRandomUser(i),
      win: Math.random() < 0.5,
      user1P: Math.floor(Math.random() * 10),
      user2P: Math.floor(Math.random() * 10),
    };
    matches.push(match);
  }

  const matchElements = matches.map((match) => (
    <div className="winLose" key={match.matchId}>
      <img src={match.otherUser.image} alt="" />
      <p>{match.win ? "win" : "Lose"} Against {match.otherUser.username}</p>
      <p>3 - 1</p>
    </div>
  ));

  const [toggleState, setToggleState] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [scrollFlag, setScrollFlag] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex: number) => (prevIndex === 0 ? matches.length - 8 : prevIndex - 8));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex: number) => (prevIndex === matches.length - 8 ? 0 : prevIndex + 8));
  };

  const handleToggleChange = () => {
    setToggleState(!toggleState);
    setShowPopup(!showPopup);
  };

  const [userData, setUserData] = useState<User | null>(null);
  const [friendData, setFriendData] = useState<Friends | null>(null);
  const fetchData = () => {
    const fetchUserData = axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, { withCredentials: true });
    const fetchAdditionalData = axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/friends`, { withCredentials: true });

    Promise.all([fetchUserData, fetchAdditionalData])
      .then((responses) => {
        const userDataResponse = responses[0];
        const additionalDataResponse = responses[1];

        if (userDataResponse.status === 200 && additionalDataResponse.status === 200) {
          const userData = userDataResponse.data;
          const friendData = additionalDataResponse.data;

          const fetchedUser: User = {
            id: userData.id,
            username: userData.username,
            image: userData.image,
            gameWon: userData.gameWon,
            gameLost: userData.gameLost,
            achievements: userData.achievements,
          };

          setUserData(fetchedUser);
          setFriendData(friendData);
        } else {
          throw new Error('Request failed');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pollUserData = () => {
    fetchData(); // Fetch the latest userData from the server
    setTimeout(pollUserData, 5000); // Poll every 5 seconds (adjust the interval as needed)
  };

  useEffect(() => {
    pollUserData();
  }, []);

  const navigate = useNavigate();
  const [matchHistoryData, setMatchHistoryData] = useState<Match[]>([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/match-history`, { withCredentials: true })
      .then((response) => {
        setMatchHistoryData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (
    <div>
      <MyHeader />
      <div className="profileAndFriends">
        <div className="profile">
          <QRpopup />
          <h3 id="profileScore">score : {userData?.gameLost ? userData?.gameLost : 0}</h3>
          <div className="ProfilePictureUsername">
            <img id="profileImg" src={userData?.image} alt="" />
            <p id="profileUsername">{userData?.username}</p>
            <EditProfileIcon />
          </div>
          <div className="WinLoss">
            <div className="Win">
              <p>Win: {userData?.gameWon || '0'}</p>
            </div>
            <div className="Loss">
              <p>Loss: {userData?.gameLost || '0'}</p>
            </div>
          </div>
          <div className="achievement">
            <p>Achievement</p>
            <div className="achievementIcons">
            {(userData?.achievements[0] == "1" || userData?.achievements[0] == "2" || userData?.achievements[0] == "3" )&& <img src={bronze} alt="" />}
              {(userData?.achievements[0] == "2" || userData?.achievements[0] == "3") && <img src={silver} alt="" />}
              {userData?.achievements[0] == "3" &&<img src={gold} alt="" />}
            </div>
          </div>
        </div>
        <div className="friends">
          <h1>Friends</h1>
          {
            friendData?.length > 0 &&
            <div className="friendslistScrollBar">
              {!scrollFlag &&
                friendData &&
                friendData.map((data: {
                  friend: {
                    id: number;
                    image: string;
                    username: string;
                  };
                }) => (
                  <div
                    onClick={() => {
                      navigate(`/user/${data.friend.id}`);
                    }}
                    key={data.friend.id}
                    className="friend"
                  >
                    <img src={data.friend.image} alt="" />
                    <p>{data.friend.username}</p>
                  </div>
                ))}
              {friendData?.length && friendData.length > 5 && (
                <a onClick={switchScrollFlag}>
                  {!scrollFlag ? `And ${friendData.length} More` : "Show Less"}
                </a>
              )}
            </div>
          }
        </div>


        <div className="matches">
          {matchHistoryData.length > 0 ? (
            <>
              <h1>Matches</h1>
              <div className="winLoseContainter">
                <div className="winLoseLeft">
                  {matchHistoryData.slice(currentIndex, currentIndex + 8).map((match) => (
                    <div className="winLose" key={match?.matchId}>
                      <img src={match.otherUser.image} alt="" />
                      <p>{match.win ? 'Win' : 'Lose'} Against {match.otherUser.username}</p>
                      <p>{match.user1P} - {match.user2P}</p>
                    </div>
                  ))}
                </div>
              </div>

              {(<div className="nextBackButtons">
                {
                  currentIndex + 1 === 1 ?
                    <button style={{ color: "gray" }}>
                      <img id="backButton" src={backButtonGray} alt="" />
                      back
                    </button>
                    :
                    <button onClick={handlePrevClick}>
                      <img id="backButton" src={backButton} alt="" />
                      back
                    </button>
                }

                <p>{currentIndex + 1} - {currentIndex + 8 < matchHistoryData.length ? currentIndex + 8 : matchHistoryData.length} of {matchHistoryData.length}</p>
                {
                  currentIndex + 8 <= matchHistoryData.length ?
                    <button onClick={handleNextClick}>
                      Next
                      <img id="nextButton" src={nextButton} alt="" />
                    </button>
                    :
                    <button style={{ color: "gray" }}>
                      Next
                      <img id="nextButton" src={nextButtonGray} alt="" />
                    </button>
                }
              </div>)}
            </>) : (
            // </div>
            <div className="noMatchHistory">Player Has No Match History!</div>)
          }

        </div>
      </div>
    </div>
  );
}

export default MyProfileUser;
