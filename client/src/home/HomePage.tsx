import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [logo, setLogo] = useState<string>(
    " https://imglarger.com/Images/before-after/ai-image-enlarger-1-after-2.jpg"
  );
  const [login, setLogin] = useState<string>("Welcome to the Home Page!");
  const SendFriendRequest = () =>{
    const requestData = {
      receiverId: 98782, // User ID of the receiver
    };
    axios
  .post('http://localhost:3000/friends/send-friend-request', requestData, {
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
  const AcceptdFriendRequest = () =>{
    const requestData = {
      receiverId: 90498, // User ID of the receiver
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
  .post('http://localhost:3000/chat/join', requestData, {
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
  const fetchdata = () => {
    axios
      .get("http://localhost:3000/user/me", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setLogo(response.data.image);
          setLogin("Welcome " + response.data.username );
        } else {
          throw new Error("Request failed");
        }
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
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
  fetchdata();
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
        Send Friend Request
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
        Accept Friend Request
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
    </div>
  );
};

export default HomePage;
