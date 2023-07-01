import 'bootstrap/dist/css/bootstrap.css';
import React, { useEffect, useRef, useState } from 'react';
import '../css/style.css'
import '../css/DST.css'
import imm from '../img/pic.jpeg'
import me from '../img/rimney.jpeg'

function getActualWindowDientions() {
    const [windowDimensions, setWindowDimensions] = useState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  
    useEffect(() => {
      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    return (windowDimensions);
  }
  

  function DSTeam(): JSX.Element {
  
    return (
      <div>
       <header className='header'>
          <h3 className="logo">Keep It Random !</h3>
          <div  className="discoverTeam">
            <h2 className='discover-team-h2'>Discover</h2>
            <h2 className='discover-team-h' >Team</h2>
          </div>
          <div className="button_animation">
            <a href="#"><span>Play</span></a>
            </div>
        </header>
    <br/>
    <div className="discover-this-amazing-team">
      <p>Discover</p>
      <p>This</p>
      <p>Amazing</p>
      <p>Team</p>
      <p>Work</p>
    </div>
    <br/>
    <div className="ping-pong-reboot">
      <h1 className="ping-ping-reboot-h1">Ping Pong Reboot 2023</h1>
        <div id="pingPongRebootText" className="ping-pong-reboot-text">
        <p>Have you ever played Pong? If not, it is the perfect time to start playing one of the earliest, and popular, video games!
            <br/>
            Pong is a table tennis-themed game released in 1972 by Atari. This 1v1 game consists of two paddles used by players to hit the ball back and forth. The goal for each player is to reach the maximum number of points before their opponent.
            Today, Pong is back like you’ve never thought it could be!
            <br/>
            Meet Pong-enthusiasts, make new friends and hit the leaderboard!</p>
            {/* <button className={playButton} className="PlayButton">Try It</button> */}
            <div className="button_animation">
            <a href="#"><span>Try It!</span></a>
            </div>
          </div>
    </div>
    <br/>
    <div className="meet-the-team">
      <p className="meet-the-team-h1"> Meet the team </p>
      <p className="meet-the-team-h3"> the creative minds who brought out site to life !</p>
      <div className="meet-the-team-line"></div>
      <div className="meet-the-team-images">
  <div  className="meet-the-team-image">
      <img src={me} alt="" />
      <div className="overlay overlayBottom">
        <p id='header_text'>Riyad Mney</p>
        <p id='paragraphImg'>
          Bla Bla Bla BlaBla Bla Bla Bla Bla Bla Bla Bla Bla
          Bla Bla Bla BlaBla Bla Bla Bla Bla Bla Bla Bla Bla
          Bla Bla Bla BlaBla Bla Bla Bla Bla Bla Bla Bla Bla
          Bla Bla Bla BlaBla Bla Bla Bla Bla Bla Bla Bla Bla
        </p>
      </div>
    </div>
  <div className="meet-the-team-image" >
  <img src={me} alt="" />
      <div className="overlay overlayBottom">
        <p id='header_text'>Riyad Mney</p>
        <p id='paragraphImg'>
          Bla Bla Bla BlaBla Bla Bla Bla Bla Bla Bla Bla Bla
          Bla Bla Bla BlaBla Bla Bla Bla Bla Bla Bla Bla Bla
          Bla Bla Bla BlaBla Bla Bla Bla Bla Bla Bla Bla Bla
          Bla Bla Bla BlaBla Bla Bla Bla Bla Bla Bla Bla Bla
        </p>
      </div>
    </div>
  <div className="meet-the-team-image"  />
  <div className="meet-the-team-image"  />
</div>

    </div>
    <br/>
    <br/>
    <div className="dsFooter" >
      <h2 className="footer-text">ft_transcendance, a 42 project</h2>
      <p className="footer-text">Made with love by Mohammed x 2, Barae and riyad</p>
    </div>
    </div>
    );
  }
  export default DSTeam;

