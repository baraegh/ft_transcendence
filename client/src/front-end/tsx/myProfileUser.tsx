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
import nextButton from '../img/next.png'
import backButton from '../img/back.png'

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


function myProfileUser(): JSX.Element {
    const switchScrollFlag = () => {
        setScrollFlag(!scrollFlag);
        console.log(!scrollFlag + ' < switched');
    };
    const generateRandomUser = (index: number): OtherUser => {
        const randomId = Math.floor(Math.random() * 1000);
        const randomImage = me;
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
        console.log(matches);

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
                        <a onClick={switchScrollFlag}>{!scrollFlag ? `And ${friends.length - 5} More` : "Show Less"}</a>
                    </div>
                </div>

                <div className='matches'>
                    <h1>Matches</h1>
                    <div className='winLoseContainter'>
                        <div className='winLoseLeft'>
                            {matchElements.slice(currentIndex, currentIndex + 4)}
                        </div>
                        <div className='winLoseLine'></div>
                        <div className='winLoseRight'>
                            {matchElements.slice(currentIndex + 4, currentIndex + 8)}
                        </div>
                    </div>
                    <div className="nextBackButtons">
                        <button onClick={handlePrevClick}>
                            <img id='backButton' src={backButton} alt="" />
                            back
                            </button>
                        <p>{currentIndex} - {currentIndex + 8} of {matchElements.length}</p>
                        <button onClick={handleNextClick}>Next
                        <img id='nextButton' src={nextButton} alt="" />

                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default myProfileUser;