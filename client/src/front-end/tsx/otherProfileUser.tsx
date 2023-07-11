import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import '../css/OtherProfileUser.css'
import me from '../img/rimney.jpeg'
import ach from '../img/pic.jpeg'
import MyHeader from './header'
import { useParams } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'
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

const otherUserTemplate = {
    id: 0,
    username: 'string',
    gameWon: 0,
    gameLost: 0,
    achievements: ['string'],
    updatedAt: '2023-07-11T15:52:29.338Z',
    friend: {
      id: 0,
      username: 'string',
      image: 'string'
    }
  };


function otherProfileUser(): JSX.Element {
    const [otherUser, setOtherUser] = useState(otherUserTemplate);
    const {userId} = useParams();
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
    const pollUserData = () => {
        fetchData(); // Fetch the latest userData from the server
        setTimeout(pollUserData, 1000); // Poll every 5 seconds (adjust the interval as needed)
      };
    useEffect(() => {
        pollUserData();
    }, []);
    // console.log(userData?.id + " <<");
    const friends: friend[] = Array.from({ length: 30 }, (_, index) => ({
        id: index + 1,
        username: `rimney ${index + 2}`,
        image: me,
    }));
    useEffect(() => {
        axios.get(`http://localhost:3000/other-profile/about/${userId}`, { withCredentials: true })
          .then(res => {
            // Extract the desired data from the response
            const userData = res.data;
      
            // Update the state with the extracted data
            setOtherUser(userData);
        })
        .catch(error => {
            // Handle any errors
            
            console.log(error);
        });
        console.log(otherUser);
    }, []);
    otherUser.gameWon = 160;
    otherUser.gameLost = 160;
    return (
        <div>
            <MyHeader />
            <div className='profileAndFriends'>
                <div className="profile">
                    <h3 id="profileScore"> score :  {otherUser.id}</h3>
                    <div className="ProfilePictureUsername">
                        <img src={me} alt="" />
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
                            <img src={ach} alt="" />
                            <img src={ach} alt="" />
                            <img src={ach} alt="" />
                        </div>
                        <div className='fourButtons'>
                            <div className='leftButtons'>
                                <a id="challenge" href="#"><span>Challenge</span></a>
                                <a id="message" href="#"><span>Message</span></a>
                            </div>
                            <div className='rightButtons'>
                                <a id="invite" href="#"><span>Invite</span></a>
                                <a id="block" href="#"><span>Block</span></a>
                            </div>
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
                        <a onClick={setScrollFlag}>{!scrollFlag ? `And ${friends.length - 5} More` : "Show Less"}</a>
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

export default otherProfileUser;

function Usestate(arg0: string): [any, any] {
    throw new Error('Function not implemented.')
}
