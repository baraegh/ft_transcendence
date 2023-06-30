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

function myProfileUser(): JSX.Element {
    const [toggleState, setToggleState] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleToggleChange = () => {
        setToggleState(!toggleState);
        setShowPopup(!showPopup);
    };
    const [userData, setUserData] = useState<User | null>(null);

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
  
            console.log(fetchedUser);
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
            <MyHeader />
            <div className='profileAndFriends'>
                <div className="profile">
                    <QRpopup />
                    <h3 id="profileScore">score : 200</h3>
                    <div className="ProfilePictureUsername">
                        <img id="profileImg" src={me} alt="" />
                        <p>rimney</p>
                        <EditProfileIcon />
                        {/* <img id="editIcon" src={Edit} alt="" /> */}
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