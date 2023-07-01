import 'bootstrap/dist/css/bootstrap.css';
import React, { useEffect, useState } from 'react';
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
  
    let a = 11;
    let windoWidthSave;
    let windoWidth  =  getActualWindowDientions().width;
    let windoHeight =  getActualWindowDientions().width;;
    if(windoWidth != windoWidthSave)
    console.log("HEeeeeeere >> " + windoWidth);
    console.log(windoWidth);
    console.log(windoHeight);
    windoWidthSave = windoWidth;
    
    let headerStyle: React.CSSProperties = {
      width: '95%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5px 5%',
      border: '2px solid black',
      borderRadius: '20px',
      boxShadow: '6px 8px 0px 2px rgba(0,0,0,1)',
      margin: 'auto',
      marginTop : '10px',
      marginBottom : '1px'
    };
    let discoverTeamH2 : React.CSSProperties = {
        display: 'inline-block',
        marginRight: '15px'
    };
    let playButton :  React.CSSProperties = {
        width: "70px",
        fontSize: "30px",
        backgroundColor: "white",
        border: "2px solid black",
        borderRadius: "10px"
    };
    let discoverThisAmazingTeam :  React.CSSProperties = {
        display: "flex",
        margin: "auto",
        height: "750px",
        width: '95%',
        border: "2px solid black",
        borderRadius: "20px",
        backgroundColor: "black",
        boxShadow: "6px 6px 0px 2px rgb(172, 169, 169)"
        };
    let pingPongReboot : React.CSSProperties = {
        margin: "auto",
        width: "95%",
        height: "430px",
        border: "2px solid black",
        borderRadius: "20px",
        boxShadow: "6px 6px 0px 2px black"
    };
    let pingPingRebootH1:  React.CSSProperties = {
      marginLeft: "50px",
      marginTop: '31px'
    };
    let pingPongRebootText:  React.CSSProperties = {
      fontSize: "24px",
      width: "50%",
      height: "50%",
      marginLeft: "50px",
      // marginBottom: "50px",
      display: "inline-block",
      paddingBottom: '10px'
    };
    let pingPongPhoto  :  React.CSSProperties = {
      position: 'relative',
      backgroundColor: "green",
      height: "300px",
      width: "300px",
      display: "inline-block",
      marginLeft: '20px',
      bottom: '150px',
      left: '10%'
    };
    let discoverThisAmazingTeamTitle:  React.CSSProperties = {
      fontSize: '120px',
      marginTop: '1%',
      color: 'white',
      marginLeft: '7%',
      lineHeight: '0.98' // Adjusted line-height value
    };
    let meetTheTeam:  React.CSSProperties = {
      margin: "auto",
      width: "95%",
      height: "460px",
      border: "2px solid black",
      borderRadius: "20px",
      boxShadow: "6px 6px 0px 2px black",
    }
    let meetTheTeamH1 :  React.CSSProperties = {
      position: 'relative',

      textAlign: "center",
      fontSize: "100px",
      bottom: '20px'
    };
    let meetTheTeamH3 :  React.CSSProperties = {
      textAlign: "center",
      fontSize: "40px",
      position: 'relative',
      bottom: '15%'

    };
    let meetTheTeamLine:  React.CSSProperties = {
      position: 'relative',
      borderBottom: '5px solid',
      backgroundColor: 'black',
      bottom: '12%'
    };
    let meetTheTeamImages :  React.CSSProperties = {
      position: 'relative',
      bottom: '13%',
      width: '90%',
      height: '60%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent : 'space-between',
      alignItems : 'center',
      margin: 'auto'
    };
    let meetTheTeamImage :  React.CSSProperties = {
      width: '230px',
      position: 'relative',
      borderRadius: "30px",
      boxShadow: "12px 10px 0px 0px black",

    }
    let footer :  React.CSSProperties = {
      position: 'relative',
      bottom : '30px',
      flexDirection: 'column',
      display: "flex",
      margin: "auto",
      width: "95%",
      justifyContent: 'center',
      alignItems: 'center',
      height: "100px",
      border: "2px solid black",
      borderRadius: "20px",
      boxShadow: "6px 6px 0px 2px black"
    };
    let footerH2 :  React.CSSProperties = {
      position: 'relative',
      textAlign: 'center',
    }
    let footerText :  React.CSSProperties = {
      position: 'relative',
      top: '-10px',
      right: '0.17%',
      lineHeight: '',
      fontFamily: 'Mplus 1p'
    };
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
    <div className="discover-this-amazing-team">
      <p className="pingPongRebootText">Discover</p>
      <p>This</p>
      <p>Amazing</p>
      <p>Team</p>
      <p>Work</p>
    </div>
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
            <img src={imm} className=".ping-pong-photo"></img>
    </div>
    <br/>
    <div className="meet-the-team">
      <p className="meet-the-team-h1"> Meet the team </p>
      <p className="meet-the-team-h3"> the creative minds who brought out site to life !</p>
      <div className="meet-the-team-line"></div>
      <div className="meet-the-team-images">
        <div>
      <img src={me}  className="meet-the-team-image"/>
          <p className="textName1">Riad mney<br />
        </p>
      <p className="dercription1">fhfhfhfhfhfhfhfhfhff</p>
    </div>
  
      </div>
    </div>
    <br/>
    <br/>
    <div className="footer" >
      <h2 className="footer-text">ft_transcendance, a 42 project</h2>
      <p className="footer-text">Made with love by Mohammed x 2, Barae and riyad</p>
    </div>
    </div>
    );
  }
  export default DSTeam;