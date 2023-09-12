import Bell from '../img/bell.png';
import '../css/header.css';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Notification from './notification'
import "../css/home.css";
import Game from "../../game/example";
import { SocketContext } from '../../socket/socketContext';
import accept from '../img/accept.png'
import decline from '../img/decline.png'

interface User {
  id: number;
  username: string;
  image: string;
  gameWon: number;
  gameLost: number;
  achievements: string[];
}

interface Notification {
  id: number;
  image: string;
  username: string;
}

function MyHeader(): JSX.Element {
  const location = useLocation();
  const { socket } = useContext<any | undefined>(SocketContext);
  type modeType = { pColor: string, bColor: string, fColor: string, bMode: string };
  const [notificationData, setNotificationData] = useState<Notification[]>([]);
  const navigate = useNavigate();

  const [login, setLogin] = useState<string>("Welcome to the Home Page!");
  const [userData, setUserData] = useState<User | null>(null);
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [data, setData] = useState({
    player1Id: "", player2Id: "", mode: { pColor: "WHITE", bColor: "GRAY", fColor: "BLACK", bMode: "" },
  });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      try {

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          const cdata = { userId: response.data.id };
          socket.emit('connect01', cdata);
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        localStorage.clear();
        window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/home`;
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {

    if (socket) {
      socket.on("startGame", (msg: modeType) => {
        socket.emit('initGameToStart', msg)
        navigate('/gamePlay');
      });
    }
    if (socket) {
      socket.on("gameRequestResponse", (data: { player1Id: string, player2Id: string, mode: modeType, numplayer1Id: number, numplayer2Id: number }) => {
        setShowNotification(true);
        setData(data);
      });
    }
  }, [socket, showNotification]);

  const holder: any = useState([]);
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("isLoggedIn");

    if(storedLoggedIn === "true")
    {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/notification/all_friend_req`, { withCredentials: true })
      .then((res) => {
        setNotificationData(res.data);
        holder.push(res.data);
      })
      .catch((error) => {
        localStorage.clear();
        window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/home`;
        
      });
    }
  }, []);

  const toggleBellDropdown = () => {
    setBellDropdownOpen(!bellDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, null, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("isLoggedIn", "false");
          window.location.reload(); // Reload the page
        }
        else {
          throw new Error("Request failed");
        }
      })
      .catch((error) => {
        // Handle the error
      });
  };

  const fetchData = () => {
  const storedLoggedIn = localStorage.getItem("isLoggedIn");

    if(storedLoggedIn === "true")
    {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, { withCredentials: true })
      .then((response) => {
        if (response.status === 401)
          window.location.reload();

        if (response.status === 200) {
          const data = response.data;
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
      });
    }
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

  function acceptFriendRequest(userId: string) {
    axios.patch(`${import.meta.env.VITE_BACKEND_URL}/friends/accept-friend-request`, { "receiverId": Number(userId) }, { withCredentials: true })
      .then((res) => {
        if (res.status === 200)
          console.log("Accepted successfully!");
        document.location.reload();
      });
  }

  function declineFriendRequest(userId: string) {
    axios.patch(`${import.meta.env.VITE_BACKEND_URL}/notification/delet-friend-request`, { "receiverId": Number(userId) }, { withCredentials: true })
      .then((res) => {
        if (res.status === 200)
          console.log("Rejected successfully!");
        document.location.reload();
      });
    document.location.reload();
  }

  // Poll notifications every 5 seconds
  useEffect(() => {
  const storedLoggedIn = localStorage.getItem("isLoggedIn");

    if(storedLoggedIn === "true")
    {

    const interval = setInterval(() => {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/notification/all_friend_req`, { withCredentials: true })
        .then((res) => {
          setNotificationData(res.data);
          holder.push(res.data);
        })
        .catch((error) => {
          localStorage.clear();
          window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/home`;
        });
    }, 5000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }
  }, []);

  return (
    <div>
      <header>
        <Notification buttonText="" showNotification={showNotification} setShowNotification={setShowNotification} data={data} setData={setData} />
        <h3 onClick={() => {
          window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/home`;
        }} className="logo">
          Keep It Random !
        </h3>
        <div className="vertical-line"></div>
        <div className="header_buttons">
          <a onClick={() => navigate('/leaderboard')} id="Lbutton" href="#">
            <span>LeaderBoard</span>
          </a>
          <a onClick={() => navigate('/chat')} id="Cbutton" href="#">
            <span>Chat</span>
          </a>
        </div>
        <div className="imgBell">
          <div className="bell">
            <Dropdown show={bellDropdownOpen} onToggle={toggleBellDropdown}>
              <Dropdown.Toggle className="bellImg" variant="light">
                <img src={Bell} alt="" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropDownMenu">
                {notificationData &&
                  <Dropdown.Item id="drop" href="#action1" onClick={() => console.log("EE")}>
                    <p>Invitations</p>
                  </Dropdown.Item>
                }
                {notificationData.map((notification) => (
                  <Dropdown.Item key={notification.id} id="drop" href="#action1" onClick={() => console.log("EE")}>
                    <div className="friendRequest">
                      <p>{notification.username} has sent you a friend request</p>
                      <img onClick={() => acceptFriendRequest(notification.id.toString())} id='acceptImg' src={accept} alt="" />
                      <img onClick={() => declineFriendRequest(notification.id.toString())} id='declineImg' src={decline} alt="" />
                    </div>
                  </Dropdown.Item>
                ))}
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
                  <Dropdown.Item id="drop" onClick={handleLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default MyHeader;