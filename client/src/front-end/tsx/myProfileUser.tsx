import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../css/myProfileUser.css';
import me from '../img/rimney.jpeg';
import ach from '../img/42_logo.png';
import MyHeader from '../tsx/header';
import QRpopup from '../tsx/QRpopup'
import Edit from '../img/edit.png'
import EditProfileIcon from '../tsx/editProfile'
import axios from 'axios';

interface User {
    id: number;
    username: string;
    image: string;
    gameWon: number;
    gameLost: number;
    achievements: string[];
  }

interface Friends {
    blocked: boolean;
    isRequested: boolean;
    isFriend: boolean;
    requestAccepted: boolean;
    friend : {
        id : number,
        username : string;
        image : string;
    }
}

function myProfileUser(): JSX.Element {
    const [toggleState, setToggleState] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleToggleChange = () => {
        setToggleState(!toggleState);
        setShowPopup(!showPopup);
    };
    const [userData, setUserData] = useState<User | null>(null);
    const [friendData, setFriendData] = useState<Friends | null>(null);

    const fetchData = () => {
        const fetchUserData = axios.get('http://localhost:3000/user/me', { withCredentials: true });
        const fetchAdditionalData = axios.get('http://localhost:3000/user/friends', { withCredentials: true });
      
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
      
              const fetchedFriends: Friends = {
                blocked: friendData.blocked,
                isRequested: friendData.isRequested,
                isFriend: friendData.isFriend,
                requestAccepted: friendData.requestAccepted,
                friend: friendData.friend,
              };
      
              setUserData(fetchedUser);
              setFriendData(fetchedFriends);
              console.log(friendData);
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
            <MyHeader />
            <div className='profileAndFriends'>
                <div className="profile">
                    <QRpopup />
                    <h3 id="profileScore">score : 200</h3>
                    <div className="ProfilePictureUsername">
                        <img id="profileImg" src={userData?.image} alt="" />
                        <p>{userData?.username}</p>
                        <EditProfileIcon />
                    </div>
                    <div className='WinLoss'>
                        <div className='Win'>
                            <p>Win : {userData && userData.gameWon || '33'}</p>
                        </div>
                        <div className='Loss'>
                        <p>Loss : {userData && userData.gameLost || '11'}</p>
                        </div>
                    </div>
                    <div className='achievement'>
                        <p>Achievement</p>
                        <div className='achievementIcons'>
                            <img src={ach} alt="" />
                            <img src={ach} alt="" />
                            <img src={ach} alt="" />
                        </div>
                    </div>
                </div>
                <div className="friends">
                    <h1>Friends</h1>
                    <div className='friendslist'>
                        <div className='friend'><img src={me} alt="" /><p> rimney</p></div>
                        <div className='friend'><img src={me} alt="" /><p> rimney</p></div>
                        <div className='friend'><img src={me} alt="" /><p> rimney</p></div>
                        <div className='friend'><img src={me} alt="" /><p> rimney</p></div>
                        <div className='friend'><img src={me} alt="" /><p> rimney</p></div>
                        <div className='friend'><img src={me} alt="" /><p> rimney</p></div>
                        <div className='friend'><img src={me} alt="" /><p> rimney</p></div>
                        <div className='friend'><img src={me} alt="" /><p> rimney</p></div>
                        <div className='friend'><img src={me} alt="" /><p> rimney</p></div>
                        <div className='friend'><img src={me} alt="" /><p> rimney</p></div>
                        <div className='friend'><img src={me} alt="" /><p> rimney</p></div>
                    </div>
                </div>
                <div className='matches'>
                    <h1>Matches</h1>
                    <div className='winLoseContainter'>
                        <div className='winLoseLeft'>
                            <div className='winLose'><img src={me} alt="" /><p>win Against Simo</p><p>3 - 1</p></div>
                            <div className='winLose'><img src={me} alt="" /><p>win Against Simo</p><p>3 - 1</p></div>
                            <div className='winLose'><img src={me} alt="" /><p>win Against Simo</p><p>3 - 1</p></div>
                            <div className='winLose'><img src={me} alt="" /><p>win Against Simo</p><p>3 - 1</p></div>
                        </div>
                        <div className='winLoseLine'></div>
                        <div className='winLoseRight'>
                            <div className='winLose'><img src={me} alt="" /><p>win Against Simo</p><p>3 - 1</p></div>
                            <div className='winLose'><img src={me} alt="" /><p>win Against Simo</p><p>3 - 1</p></div>
                            <div className='winLose'><img src={me} alt="" /><p>win Against Simo</p><p>3 - 1</p></div>
                            <div className='winLose'><img src={me} alt="" /><p>win Against Simo</p><p>3 - 1</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default myProfileUser;