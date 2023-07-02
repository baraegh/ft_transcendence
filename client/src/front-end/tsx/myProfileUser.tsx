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

interface friend {
    id: number,
    username: string;
    image: string;
}

interface Friends {
    blocked: boolean;
    isRequested: boolean;
    isFriend: boolean;
    requestAccepted: boolean;
    friend: {
        id: number,
        username: string;
        image: string;
    }
}



function myProfileUser(): JSX.Element {
    const switchScrollFlag = () => {
        setScrollFlag(!scrollFlag);
        console.log(!scrollFlag + ' < switched');
      };
    const [toggleState, setToggleState] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [scrollFlag, setScrollFlag] = useState(false);

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
                    // console.log(friendData);
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
    const friends: friend[] = Array.from({ length: 30 }, (_, index) => ({
        id: index + 1,
        username: `rimney ${index + 2}`,
        image: me,
    }));
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
  <div className="friendslistScrollBar">
    {!scrollFlag ? (
      Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="friend">
          <img src={friends[index].image} alt="" />
          <p>{friends[index].username}</p>
        </div>
      ))
    ) : (
      friends.map((friend, index) => (
        <div key={index} className="friend">
          <img src={friend.image} alt="" />
          <p>{friend.username}</p>
        </div>
      ))
    )}
    <a onClick={switchScrollFlag}> And {friends.length - 5} More</a>
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