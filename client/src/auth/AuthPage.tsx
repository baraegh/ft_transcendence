import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/";
  };

  const check = () => {
    axios
      .get("http://localhost:3000/auth/check", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          navigate("/home");
        }
      })
  };
  check();
  return (
    <div>
      <h1>Auth Page</h1>
      <button
        onClick={handleLogin}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Login with 42Network
      </button>
    </div>
  );
};
export default AuthPage;
