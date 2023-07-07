import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [logo, setLogo] = useState<string>(
    " https://imglarger.com/Images/before-after/ai-image-enlarger-1-after-2.jpg"
  );
  const [getid, setid] = useState<number>();
  const [login, setLogin] = useState<string>("Welcome to the Home Page!");
  const [socket, setSocket] = useState<Socket | null>(null); // Declare socket state

  const challenge = () =>{
    console.log("challenge")
    const requestData = {
      challengerId: getid, // User ID of barae
      login:login
    };

  if (socket) {
      let data = {
        userId: 98782,//barae
        cData: requestData
      }
      socket.emit('sendGameRequest', data);
    }
  }

  const leaveroom = () =>{

  if (socket) {
    socket.emit('leaveRoom', '1');
    console.log("leaved");
    }
  }
  const sendingroup = () =>{

  if (socket) {
    socket.emit('chatToServer', { sender: "this.username", room: "1", message: "this.text" });
    console.log("send");
    }
  }
  const joiroom = () =>{
    if (socket) {
      socket.emit('joinRoom', "1");
      console.log("join");
    }
  }

  const SendFriendRequest = () =>{
    
    const requestData = {
        receiverId: 98782
    };
    axios
  .post('http://localhost:3000/friends/send-friend-request', requestData, {
    headers: {
      'Content-Type': 'application/json',
    },withCredentials: true, 
  })
  .then(response => {
    console.log(response.data);
    const RrequestData = {
      friendId: getid, // User ID of barae
      login:login
    };
    if (socket) {
      let data = {
        userId: 98782,//barae
        cData: RrequestData
      }
      socket.emit('sendFriendRequest', data);
    }
  })
  .catch(error => {
    console.error(error);
  });
  }
  const AcceptdFriendRequest = () =>{
    const requestData = {
      receiverId: 90498, // User ID of von
    };
    axios
  .patch('http://localhost:3000/friends/accept-friend-request', requestData, {
    headers: {
      'Content-Type': 'application/json',
    },withCredentials: true, 
  })
  .then(response => {
    console.log(response.data);
    
  })
  .catch(error => {
    console.error(error);
  });
  }

  const joinchatwithfriend = () => {
    const requestData = {
      receiverId: 98782, // User ID of barae
    };
    axios
  .post('ht`tp://localhost:`3000/chat/join-friend', requestData, {
    headers: {
      'Content-Type': 'application/json',
    },withCredentials: true, 
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
  };
  const handleLogout = () => {
    axios
      .post("http://localhost:3000/auth/logout", null, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          navigate("/");
        } else {
          throw new Error("Request failed");
        }
      })
      .catch((error) => {
        console.log(error);
        // Handle the error
      });
  };


  const userFefriends = () => {
    axios
      .get("http://localhost:3000/user/friends", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
        } else {
          throw new Error("Request failed");
        }
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      });
  };
  const handleChat = () => {
    // Perform logout logic here
    navigate("/chat");
  };




 
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/me", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setLogo(response.data.image);
          setLogin("Welcome " + response.data.username);
          setid(response.data.id);
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };
  
    fetchdata();
  }, []);
  
  useEffect(() => {
    const connectToSocket = () => {
      const newSocket = io('http://localhost:3000', {
        query: { user: encodeURIComponent(JSON.stringify({ id: getid })) },
      });

      newSocket.on('connect', () => {
        const requestData = {
          event: 'userConnected',
          user: { id: getid },
        };
        newSocket.emit('requestData', requestData);
      });

      newSocket.on('gameRequestResponse', (data) => {
        console.log('Received data from server:', data);
        // Perform actions with the received data
        setReceivedData(data);
      });

        newSocket.on('FriendRequestResponse', (data) => {
      console.log('Received data from server:', data);
      // Perform actions with the received data
      setReceivedData(data);
    });

    newSocket.on('chatToClient', (msg) => {
      console.log(msg);
    });

    setSocket(newSocket);

    return newSocket;
    };


    if (getid !== undefined) {
      const newSocket = connectToSocket();
      setSocket(newSocket);

    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [getid]);
  
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px" }}>{login}</h2>
      <div
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          overflow: "hidden",
          margin: "0 auto",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Log Out
      </button>
      <button
        onClick={handleChat}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Chat
      </button>
      <button
        onClick={ SendFriendRequest}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Send Friend Request to barae
      </button>
      <button
        onClick={ AcceptdFriendRequest}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Accept Friend Request for von
      </button>
      <button
        onClick={ userFefriends}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        All Friends
      </button>
      <button
        onClick={ joinchatwithfriend}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        join chat with barae
      </button>
      <button
        onClick={ challenge}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        challenge
      </button>
      <button
        onClick={ joiroom}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        joiroom
      </button>

      <button
        onClick={ leaveroom}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        leaverrom
      </button>

      <button
        onClick={ sendingroup}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        sendingroup
      </button>
    </div>
  );
};

export default HomePage;
function setReceivedData(data: any) {
  console.log("Function not implemented.",data);
}

