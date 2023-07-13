import Bell from '../img/bell.png';
import '../css/header.css';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Notification from './notification'
import "../css/home.css";
import Game from "../../game/example";
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
  type modeType = {pColor: string, bColor: string, fColor:string, bMode:string};
  
  const navigate = useNavigate();
  
  
  const [login, setLogin] = useState<string>("Welcome to the Home Page!");
  const [userData, setUserData] = useState<User | null>(null);
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [data, setData]  = useState({
    player1Id: "", player2Id: "", mode: {pColor: "WHITE", bColor: "GRAY", fColor: "BLACK", bMode: ""},
  });

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/me", {
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log(response.data.id);
          const cdata = { userId: response.data.id};
          socket.emit('connect01',cdata);
          console.log("connect01");
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {
    // Use the socket instance here

    if (socket) {
      {
        console.log("CREATED >> ");
        socket.on("startGame", (msg: modeType) => {
          socket.emit('initGameToStart', msg)
          navigate('/gamePlay');
          console.log('connected to Game');
        });
        // console.log(socket);
      }
    }
    if(socket)
    {
      socket.on("gameRequestResponse",  (data: {player1Id: string, player2Id: string, mode: modeType, numplayer1Id: number, numplayer2Id: number}) =>{
        console.log("gameRequestResponse" + data);
        setShowNotification(true);
        console.log(showNotification);
        setData(data);
      });
    }
  }, [socket,showNotification]);
  


    
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
    <div>
      <header>
      <Notification buttonText=" "  showNotification={showNotification} setShowNotification={setShowNotification} data={data} setData={setData} />
        <h3 onClick={() => {{
                            navigate('/home');
                            document.location.reload();
                            }}} className="logo">
          KIR
        </h3>
        <div className="vertical-line"></div>
        <div className="header_buttons">
          <a onClick={() => navigate('/leaderboard')} id="Lbutton" href="#">
            <span>LeaderBoard</span>
          </a>
          <a onClick={() =>  navigate('/chat')} id="Cbutton" href="#">
            <span>Chat</span>
          </a>

        </div>
          <div className="bell">
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
          </div>
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
      </header>
    </div>
  );
}

export default MyHeader;

// function setShowNotification(arg0: boolean) {
//   throw new Error('Function not implemented.');
// }

// function setData(data: { player1Id: string; player2Id: string; mode: { pColor: string; bColor: string; fColor: string; bMode: string; }; numplayer1Id: number; numplayer2Id: number; }) {
//   throw new Error('Function not implemented.');
// }
// function setShowNotification(arg0: boolean) {
//   throw new Error('Function not implemented.');
// }

// function setData(data: { player1Id: string; player2Id: string; mode: { pColor: string; bColor: string; fColor: string; bMode: string; }; numplayer1Id: number; numplayer2Id: number; }) {
//   throw new Error('Function not implemented.');
// }

