import React, { Key, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../css/otherProfileUser.css';
import me from '../img/rimney.jpeg';
import ach from '../img/pic.jpeg';
import MyHeader from './header';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import nextButton from '../img/next.png';
import nextButtonGray from '../img/nextGray.png';
import backButton from '../img/back.png';
import backButtonGray from '../img/backGray.png';
import Maps from './maps';
import Notification from './notification';
import { SocketContext } from '../../socket/socketContext';
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

interface friend {
  id: number;
  username: string;
  image: string;
}

interface Friends extends Array<{
  blocked: boolean;
  isRequested: boolean;
  isFriend: boolean;
  requestAccepted: boolean;
  friend: friend;
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
  gameWon: number;
  gameLost: number;
  updatedAt: string;
  blocked: boolean;
  hosblocked: number;
  isRequested: boolean;
  isFriend: boolean;
  requestAccepted: boolean;
}

const Buttons = {
  isFriend: false,
  isBlocked: false
};

const otherUserTemplate: OtherUser = {
  id: 0,
  username: "string",
  image: "string",
  gameWon: 0,
  gameLost: 0,
  updatedAt: "2023-07-13T03:31:40.829Z",
  blocked: true,
  hosblocked: 0,
  isRequested: true,
  isFriend: true,
  requestAccepted: true
};

function OtherProfileUser(): JSX.Element {
  const { socket } = useContext<any | undefined>(SocketContext);

  const [showNotification, setShowNotification] = useState(false);
  const [data, setData] = useState({
    player1Id: "",
    player2Id: "",
    mode: { pColor: "WHITE", bColor: "GRAY", fColor: "BLACK", bMode: "" },
  });

  const challenge = () => {
    // if (socket) {
    //   console.log("wwwwwaaaaaaa")
    //   socket.emit('connect01');
    // }
    // console.log(storedSocket);
    type modeType = {
      pColor: string;
      bColor: string;
      fColor: string;
      bMode: string;
    };
    let dataToSend: {
      player2Id: number;
      mode: modeType;
      name: string;
      image: string;
    } = {
      player2Id: Number(userId),
      mode: { pColor: "WHITE", bColor: "GRAY", fColor: "BLACK", bMode: "" },
      name: "von",
      image: "image"
    };
    if (socket) {
      console.log(">>>>>>send from:" + socket);
      console.log(socket.id);
      socket.emit("sendGameRequest", dataToSend);
    }
  };

  const matches: Match[] = [];
  const { userId } = useParams();
  const [otherUser, setOtherUser] = useState(otherUserTemplate);

  const generateRandomUser = (index: number): OtherUser => {
    const randomId = Math.floor(Math.random() * 1000);
    const randomImage = 'https://random.imagecdn.app/500/150';
    const randomUsername = `Other ${index}`;
    return { id: randomId, image: randomImage, username: randomUsername, gameWon: 0, gameLost: 0, updatedAt: "", blocked: false, hosblocked: 0, isRequested: false, isFriend: false, requestAccepted: false };
  };

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
    <div className='winLose' key={match.matchId}>
      <img src={match.otherUser.image} alt="" />
      <p>{match.win ? "win" : "Lose"} Agains {match.otherUser.username}</p>
      <p>3 - 1</p>
    </div>
  ));

  const [toggleState, setToggleState] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [scrollFlag, setScrollFlag] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? matches.length - 4 : prevIndex - 4));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === matches.length - 4 ? 0 : prevIndex + 4));
  };

  const handleToggleChange = () => {
    setToggleState(!toggleState);
    setShowPopup(!showPopup);
  };

  const [userData, setUserData] = useState<User | null>(null);
  const [friendData, setFriendData] = useState<Friends | null>(null);

  const fetchData = () => {
    const fetchUserData = axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, { withCredentials: true });
    const fetchAdditionalData = axios.get(`${import.meta.env.VITE_BACKEND_URL}/other-profile/friends/${userId}`, { withCredentials: true });

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
    fetchData();
    setTimeout(pollUserData, 10000); // Poll every 5 seconds
  };

  useEffect(() => {
    pollUserData();
  }, []);


  const sendFriendRequest = () => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/friends/send-friend-request/`, { "receiverId": Number(userId) }, { withCredentials: true })
      .then(() => {
        console.log("Friend Request Sent");
        setOtherUser(prevUser => ({
          ...prevUser,
          isRequested: true
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function blockFriend() {
    axios.patch(`${import.meta.env.VITE_BACKEND_URL}/chat/friend/block_friend`, { "FriendId": Number(userId) }, { withCredentials: true })
      .then(() => {
        console.log("blocked");
        setButtons({ ...bbuttons, isBlocked: true });
        document.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function unblockFriend() {
    axios.patch(`${import.meta.env.VITE_BACKEND_URL}/chat/friend/unblock_friend`, { "FriendId": Number(userId) }, { withCredentials: true })
      .then(() => {
        console.log("unblocked");
        setButtons({ ...bbuttons, isBlocked: false });
        document.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [block, setBlock] = useState(false);
  const [bbuttons, setButtons] = useState(Buttons);
  const navigate = useNavigate();
  const friendDataLength = friendData ? friendData.length : 0;
  const [matchHistory, setMatchHistory] = useState<any[] | null>(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/other-profile/about/${userId}`, { withCredentials: true })
      .then(res => {
        const userData = res.data;
        setOtherUser(userData);

        if (userData.hosblocked === userData.id) {
          setBlock(true);
        }
        else
          setBlock(false);
      })
      .catch(error => {
        console.log(error);
      });
  }, [userId]);


  function handleSendMessage() {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat/join-friend`, { receiverId: Number(userId) }, { withCredentials: true })
      .then(
        (res) => { res.status === 200 ? navigate('/chat') : "" }
      );

  }

  const [matchHistoryData, setMatchHistoryData] = useState<Match[]>([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/other-profile/match-history/${userId}`, { withCredentials: true })
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
      {block ? (
        <div className='oops'>
          <p>Oops, it sounds like this user has blocked you.</p>
          <a href='' onClick={() => (navigate('/home'))}>Go Back Home</a>
        </div>
      ) : (
        <div className='profileAndFriends'>
          <div className="profile">
            <h3 id="profileScore"> score :  {otherUser.id}</h3>
            <div className="ProfilePictureUsername">
              <img src={otherUser.image} alt="" />
              <p>{otherUser.username}</p>
            </div>
            <div className='WinLoss'>
              <div className='Win'>
                <p>Win : {otherUser.gameWon}</p>
              </div>
              <div className='Loss'>
                <p>Loss : {otherUser.gameLost}</p>
              </div>
            </div>
            <div className='achievement'>
              <p>Achievement</p>
              <div className='achievementIcons'>
                <img src={bronze} alt="" />
                <img src={silver} alt="" />
                <img src={gold} alt="" />
              </div>
              <div className='fourButtons'>
                {otherUser.isFriend && !otherUser.blocked && <a className="challenge"><Maps buttonText='Challenge' /></a>}
                {otherUser.isFriend && !otherUser.blocked && <a onClick={
                  () => { handleSendMessage() }
                } className="message2"><span>Message</span></a>}
                {!otherUser.isFriend && !otherUser.blocked && !otherUser.isRequested && (
                  <a onClick={sendFriendRequest} className="invite2"><span>Friend Request</span></a>
                )}
                {otherUser.isRequested && <a className="invite2"><span> Request Sent !</span></a>}
                {!otherUser.blocked && !otherUser.blocked && (
                  <a onClick={blockFriend} className="block2">
                    <span>Block</span>
                  </a>
                )}
                {otherUser.blocked && (
                  <a onClick={unblockFriend} className="block2">
                    <span>Unblock</span>
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="friends">
            <h1>Friends</h1>
            <div className="friendslistScrollBar">
              {!scrollFlag ?
                friendData && friendData.map((data: {
                  friend: {
                    id: Key | null | undefined; image: string | undefined; username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
                  };
                }, index: React.Key | null | undefined) => (
                  <div onClick={() => {
                    if (data.friend.id !== userData?.id) {
                      navigate(`/user/${data.friend.id?.toString()}`);
                      document.location.reload();
                    }
                  }} key={data.friend.id} className="friend">
                    <img src={data.friend.image} alt="" />
                    <p> {data.friend.username === userData?.username ? "me" : data.friend.username}</p>
                  </div>
                )) : ""}
              {friendDataLength > 5 && <a onClick={setScrollFlag}>{!scrollFlag ? `And ${friendData && friendData.length} More` : "Show Less"}</a>}
            </div>
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
          {/* <div className="matches">
            <h1>Matches</h1>
            {matchHistoryData.length > 0 && (
              <div className="winLoseContainter">
                <div className="winLoseLeft">
                  {matchHistoryData.slice(currentIndex, currentIndex + 4).map((match) => (
                    <div className="winLose" key={match?.matchId}>
                      <img src={match.otherUser.image} alt="" />
                      <p>{match.win ? 'Win' : 'Lose'} Against {match.otherUser.username}</p>
                      <p>{match.user1P} - {match.user2P}</p>
                    </div>
                  ))}
                </div>
                {matchHistoryData.length > 0 && <div className="winLoseLine"></div>}
                <div className="winLoseRight">
                  {matchHistoryData.slice(currentIndex + 4, currentIndex + 8).map((match) => (
                    <div className="winLose" key={match?.matchId}>
                      <img src={match.otherUser.image} alt="" />
                      <p>{match.win ? 'Win' : 'Lose'} Against {match.otherUser.username}</p>
                      <p>{match.user1P} - {match.user2P}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {matchHistoryData.length > 0 && (
              <div className="nextBackButtons">
                <button onClick={handlePrevClick}>
                  <img id="backButton" src={backButton} alt="" />
                  back
                </button>
                <p>{currentIndex} - {currentIndex + 8} of {matchHistoryData.length}</p>
                <button onClick={handleNextClick}>
                  Next
                  <img id="nextButton" src={nextButton} alt="" />
                </button>
              </div>
            ) || <div className="noMatchHistory">Player Has No Match History !</div>}
          </div> */}
        </div>
      )}
    </div>
  );
}

export default OtherProfileUser;
