import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [logo, setLogo] = useState<string>(
    " https://imglarger.com/Images/before-after/ai-image-enlarger-1-after-2.jpg"
  );
  const [login, setLogin] = useState<string>("Welcome to the Home Page!");
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
      .get("http://localhost:3000/users/me", { withCredentials: true })
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
    </div>
  );
};

export default HomePage;
