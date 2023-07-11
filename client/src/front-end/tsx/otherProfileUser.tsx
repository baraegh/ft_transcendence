import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import '../css/OtherProfileUser.css'
import me from '../img/rimney.jpeg'
import ach from '../img/pic.jpeg'
import MyHeader from './header'
import { useParams } from 'react-router-dom'
import axios from 'axios'


function otherProfileUser(): JSX.Element {
    const [otherUser, setOtherUser] = Usestate("");
    const {userId} = useParams();
    console.log(userId + " <<");
    useEffect(() => {
        axios.get(`http://localhost:3000/other-profile/about/${userId}`, { withCredentials: true })
        .then((res) => {console.log(res)});
    }, []);
    return (
        <div>
            <MyHeader />
            <div className='profileAndFriends'>
                <div className="profile">
                    <h3 id="profileScore">score : 200</h3>
                    <div className="ProfilePictureUsername">
                        <img src={me} alt="" />
                        <p>rimney</p>
                    </div>
                    <div className='WinLoss'>
                        <div className='Win'>
                            <p>Win : 10</p>
                        </div>
                        <div className='Loss'>
                            <p>Loss : 15</p>
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

export default otherProfileUser;

function Usestate(arg0: string): [any, any] {
    throw new Error('Function not implemented.')
}
