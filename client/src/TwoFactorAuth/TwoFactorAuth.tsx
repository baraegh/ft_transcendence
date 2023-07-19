import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TwoFactorAuth: React.FC = () => {
  const [input, setInput] = useState("");



  const queryParams = new URLSearchParams(window.location.search);
  const imageParam = queryParams.get("image");
  const navigate = useNavigate();
  const [logo, setLogo] = useState(imageParam);

  const submitForm = () => {
    console.log(input);
    axios
      .post("http://localhost:3000/2fa/verified", {secret: input}, {
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
                // navigate("/home");
                console.log("EEEEE");
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
        console.log(error);
        navigate("/");

      });
  };

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
      <input type="text" id="inputText" placeholder="Enter your text" value={input} onChange={(e) => setInput(e.target.value)} />
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
