import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/leaderBoard.css'
import me from '../img/rimney.jpeg'
import MyHeader from '../tsx/header'

function LeaderBoard() : JSX.Element
{
    return (<div>
        <MyHeader />
        <div className='leaderBoard'>
            <p id="leaderBoardLabel">LeaderBoard</p>
            <p id="topPlayersLabel">TOP PLAYERS</p>
            <div className='firstRank'>
                <div className='rankNum'>
                    <p>1</p>
                </div>
                <div className='fstLine'></div>
                <div className='score'>
                    <p>250</p>
                </div>
                <div className='scLine'></div>
                <div className='rankProfile'>
                    <img src={me} alt="" />
                    <p>Ryad</p>
                </div>
                <div className='trLine'></div>
                <div className='gamesWon'>
                    <p id='scoreNum'>150</p>
                    <p id='scoreLabel'>Games won</p>
                </div>
            </div>
            <div className='firstRank'>
                <div className='rankNum'>
                    <p>1</p>
                </div>
                <div className='fstLine'></div>
                <div className='score'>
                    <p>250</p>
                </div>
                <div className='scLine'></div>
                <div className='rankProfile'>
                    <img src={me} alt="" />
                    <p>Ryad</p>
                </div>
                <div className='trLine'></div>
                <div className='gamesWon'>
                    <p id='scoreNum'>150</p>
                    <p id='scoreLabel'>Games won</p>
                </div>
            </div>
            <div className='firstRank'>
                <div className='rankNum'>
                    <p>1</p>
                </div>
                <div className='fstLine'></div>
                <div className='score'>
                    <p>250</p>
                </div>
                <div className='scLine'></div>
                <div className='rankProfile'>
                    <img src={me} alt="" />
                    <p>Ryad</p>
                </div>
                <div className='trLine'></div>
                <div className='gamesWon'>
                    <p id='scoreNum'>150</p>
                    <p id='scoreLabel'>Games won</p>
                </div>
            </div>
            <div className='firstRank'>
                <div className='rankNum'>
                    <p>1</p>
                </div>
                <div className='fstLine'></div>
                <div className='score'>
                    <p>250</p>
                </div>
                <div className='scLine'></div>
                <div className='rankProfile'>
                    <img src={me} alt="" />
                    <p>Ryad</p>
                </div>
                <div className='trLine'></div>
                <div className='gamesWon'>
                    <p id='scoreNum'>150</p>
                    <p id='scoreLabel'>Games won</p>
                </div>
            </div>
            <div className='firstRank'>
                <div className='rankNum'>
                    <p>1</p>
                </div>
                <div className='fstLine'></div>
                <div className='score'>
                    <p>250</p>
                </div>
                <div className='scLine'></div>
                <div className='rankProfile'>
                    <img src={me} alt="" />
                    <p>Ryad</p>
                </div>
                <div className='trLine'></div>
                <div className='gamesWon'>
                    <p id='scoreNum'>150</p>
                    <p id='scoreLabel'>Games won</p>
                </div>
            </div>
        </div>
    </div>);
}

export default LeaderBoard;