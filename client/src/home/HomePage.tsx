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


  const sendmsg = () =>{
    const requestData = {
      channelID: 'dc5f6d35-5c28-498b-9012-f1af63c7b7ea', // User ID of barae
      content:"hi"

    };
    axios
  .post('http://localhost:3000/chat/sendMsg', requestData, {
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

  const SendFriendRequest = () =>{
    
    const requestData = {
      receiverId: 98782, // User ID of barae
    };
    axios
  .post('http://localhost:3000/friends/send-friend-request', requestData, {
    headers: {
      'Content-Type': 'application/json',
    },withCredentials: true, 
  })
  .then(response => {
    console.log(response.data);
    if (socket) {
      socket.emit('sendGameRequest', 98782, requestData);
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

      newSocket.on('response', (data) => {
        // Handle the response from the server
        console.log('Received response:', data);
      });

        newSocket.on('gameRequestResponse', (data) => {
      console.log('Received data from server:', data);
      // Perform actions with the received data
      setReceivedData(data);
    });

    setSocket(newSocket);

    return newSocket;
    };

    if (getid !== undefined) {
      const newSocket = connectToSocket();
      setSocket(newSocket);
    }
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
        onClick={ sendmsg}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        send msg
      </button>
    </div>
  );
};

export default HomePage;
function setReceivedData(data: any) {
  throw new Error("Function not implemented.");
}

