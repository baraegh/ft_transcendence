import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TwoFactorAuth: React.FC = () => {
  const check = () => {
    axios
      .get("http://localhost:3000/auth/check", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          navigate("/home");
        }
      })
  };
  
  
  const queryParams = new URLSearchParams(window.location.search);
  const imageParam = queryParams.get("image");
  const navigate = useNavigate();
  const [logo, setLogo] = useState(imageParam);

  const submitForm = () => {
    const inputElement = document.getElementById("inputText");
    if (inputElement instanceof HTMLInputElement) {
      const inputText = inputElement.value;
      const data = {
        secret: inputText,
      };
      axios
        .post("http://localhost:3000/2fa/verified", data, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) {
            axios
              .post("http://localhost:3000/auth/refresh", null, {
                withCredentials: true,
              })
              .then((response) => {
                if (response.status === 200) {
                  navigate("/home");
                } else {
                  throw new Error("Request failed");
                }
              })
              .catch((error) => {
                console.log(error);
                navigate("/");
              });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  check();
  return (
    <div className="container">
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
      <br />
      <input type="text" id="inputText" placeholder="Enter your text" />
      <br />{" "}
      <button
        onClick={submitForm}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default TwoFactorAuth;
