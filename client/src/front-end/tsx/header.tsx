import Bell from '../img/bell.png';
import '../css/header.css';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Notification from './notification'
import "../css/home.css";
import Game from "../../game/example";
import  { getSocket, initializeSocket, maketest } from'/Users/brmohamm/Desktop/ft_trance_keep_it_random/client/src/socket/socket.tsx'
import { SocketContext } from '../../socket/socketContext';

interface User {
  id: number;
  username: string;
  image: string;
  gameWon: number;
  gameLost: number;
  achievements: string[];
}

function MyHeader(): JSX.Element {
  const { socket } = useContext<any | undefined>(SocketContext);

  useEffect(() => {
    // Use the socket instance here
    if (socket) {
      {
        console.log("CREATED >> ");
        socket.on("startGame", (msg) => {
          navigate('/gamePlay');
          console.log('connected to Game');
        });
      // console.log(socket);
      }
    }
  }, [socket]);
  
  type modeType = {pColor: string, bColor: string, fColor:string, bMode:string};

  const navigate = useNavigate();


  const [login, setLogin] = useState<string>("Welcome to the Home Page!");
  const [userData, setUserData] = useState<User | null>(null);
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleBellDropdown = () => {
    setBellDropdownOpen(!bellDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
  const handleLogout = () => {
    axios
      .post("http://localhost:3000/auth/logout", null, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          window.location.reload(); // Reload the page
        }
         else {
          throw new Error("Request failed");
        }
      })
      .catch((error) => {
        console.log(error);
        // Handle the error
      });
  };

  const fetchData = () => {
    axios
      .get('http://localhost:3000/user/me', { withCredentials: true })
      .then((response) => {
        if(response.status === 401)
        window.location.reload();

        if (response.status === 200) {
          const data = response.data;
          
          // const cdata = { userId: data.id };
          // socket.emit('connect01',cdata);
          // console.log("connect01");
          const fetchedUser: User = {
            id: data.id,
            username: data.username,
            image: data.image,
            gameWon: data.gameWon,
            gameLost: data.gameLost,
            achievements: data.achievements,
          };

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

  const SlideInModal = ({ onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 0);
  
      return () => clearTimeout(timer);
    }, [onClose]);
  
    return (
      <div className="slide-in-modal">
        <div className="content">
          <h3>Notification</h3>
          <p>This is a notification message.</p>
        </div>
      </div>
    );
  };







  return (
      <header>
        <div className='header-left'>
          <h3 onClick={() => navigate('/home')} className="logo">
            KIR
          </h3>
          <div className="vertical-line"></div>
          <div className="header_buttons">
            <a className='header-btn' onClick={() => navigate('/leaderboard')} id="Lbutton" href="#">
              <span>LeaderBoard</span>
            </a>
            <a className='header-btn' onClick={() =>  navigate('/chat')} id="Cbutton" href="#">
              <span>Chat</span>
            </a>
          </div>
        </div>

        {/* <div className="bell">
          <Dropdown show={bellDropdownOpen} onToggle={toggleBellDropdown}>
            <Dropdown.Toggle className="bellImg" variant="light">
              <img className="bellImg" src={Bell} alt="" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropDownMenu">
              <Dropdown.Item id="drop" href="#action1" onClick={() =>  {console.log("EE")}}>
                Profile
              </Dropdown.Item>
              <Dropdown.Item id="drop" href="#action1">
                Profile
              </Dropdown.Item>
              <Dropdown.Item id="drop" href="#action1">
                Profile
              </Dropdown.Item>
              <Dropdown.Item id="drop" href="#action1">
                Profile
              </Dropdown.Item>
              <Dropdown.Item id="drop" href="#action3">

              </Dropdown.Item>
              
            </Dropdown.Menu>
          </Dropdown>
        </div> */}
        <div className='header-right'>
          <Notification />
          <div className="profileImg">
            {userData && (
              <Dropdown
              show={profileDropdownOpen}
              onToggle={toggleProfileDropdown}
              >
                <Dropdown.Toggle variant="light">
                  <img src={userData.image} alt="" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropDownMenu">
                  <Dropdown.Item id="drop" onClick={() => navigate('/profile')}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item id="drop" onClick={handleLogout} >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
      </header>
  );
}

export default MyHeader;
