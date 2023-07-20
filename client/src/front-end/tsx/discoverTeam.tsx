import 'bootstrap/dist/css/bootstrap.css';
import React, { useEffect, useRef, useState } from 'react';
import '../css/style.css'
import '../css/DST.css'
import imm from '../img/pic.jpeg'
import me from '../img/rimney.jpeg'
import gif from '../img/gif.webp'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ping from '../img/ping.png'

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
  const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);


  // useEffect(() => {
  //   // const check = () => {
  //     axios
  //       .get("http://localhost:3000/auth/check", { withCredentials: true })
  //       .then((response) => {
  //         if (response.status === 200) {
  //           setIsLoggedIn(true);
  //         }
  //       })
  //   // };
  //   // check();
  // }, []);
  return (
    <div className='dstDiv'>
      <header className='header'>
        <h3 className="logo">Keep It Random !</h3>
        <div className="discoverTeam">
          <h2 className='discover-team-h2'>Discover</h2>
          <h2 className='discover-team-h'>Team</h2>
        </div>
          <a onClick={() => {navigate('/play')}} id="playB">Play</a>
      </header>
      <br />
      <div className="discover-this-amazing-team">
        <p>Discover</p>
        <p>This</p>
        <p>Amazing</p>
        <p>Team</p>
        <p>Work</p>
        <img id="gif" src={gif} alt="" />
      </div>
      <br />
      <div className="ping-pong-reboot">
        <h1 className="ping-ping-reboot-h1">Ping Pong Reboot 2023</h1>
        <div className="ping-pong-reboot-img-p">
          <p className="ping-pong-reboot-text">Have you ever played Pong? If not, it is the perfect time to start playing one of the earliest, and popular, video games!
            <br />
            Pong is a table tennis-themed game released in 1972 by Atari. This 1v1 game consists of two paddles used by players to hit the ball back and forth. The goal for each player is to reach the maximum number of points before their opponent.
            Today, Pong is back like you’ve never thought it could be!
            <br />
            Meet Pong-enthusiasts, make new friends and hit the leaderboard!</p>
          {/* <button className={playButton} className="PlayButton">Try It</button> */}
        <img id="ping" src={ping} alt="" />
          <a onClick={() => {navigate('/home')}} id="tryIt">Try It!</a>
        </div>
      </div>
      <br />
      <div className="meet-the-team">
        <p className="meet-the-team-h1"> Meet the team </p>
        <p className="meet-the-team-h3"> the creative minds who brought out site to life !</p>
        <div className="meet-the-team-line"></div>
        <div className="meet-the-team-images">
          <div className="meet-the-team-image">
            <img src="https://cdn.intra.42.fr/users/56b6ef5fd87645cbc5179e01683d4b80/eel-ghan.jpg" alt="" />
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
          <div className="meet-the-team-image" >
            <img src="https://cdn.intra.42.fr/users/49c9f954c68d136b2b41e8da9fbd4f30/mait-aad.jpg" alt="" />
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
            <img src="https://cdn.intra.42.fr/users/43a0c860ec59fd992226a7dfb151af7e/brmohamm.jpg" alt="" />
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

        </div>

      </div>
      <br />
      <br />
      <div className="dsFooter" >
        <h2 className="footer-text">ft_transcendance, a 42 project</h2>
        <p className="footer-text">Made with love by Mohammed x 2, Barae and riyad</p>
      </div>
    </div>
  );
}
export default DSTeam;

