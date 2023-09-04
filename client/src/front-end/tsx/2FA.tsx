import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'
import '../css/2FA.css'
import me from '../img/rimney.jpeg'
import { useNavigate } from 'react-router-dom';
import { userMe } from '../../App';

const TwoFactorAuth: React.FC = () => {
  const [input, setInput] = useState("");



  const queryParams = new URLSearchParams(window.location.search);
  const imageParam = queryParams.get("image");
  const navigate = useNavigate();
  const [logo, setLogo] = useState(imageParam);


  const submitForm = () => {
    console.log("@2222222");
    console.log(input);
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/2fa/verified`, {secret: input}, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, null, {
              withCredentials: true,
            })
            .then((response) => {
              if (response.status === 200) {
                console.log("PASSED");
                document.location.reload();
              } else {
                throw new Error("Request failed");
              }
            })
            .catch((error) => {
              // console.log()
              console.log(error);
              // navigate("/");
            });
        }
      })
      .catch((error) => {
        console.log(error);
        // navigate("/");

      });
      console.log("eEEEEEEEEEEEEEE");
  };

  return (
    <div className="mainDiv">
    
        <img
          src={logo}
          alt="Logo"
          className='UserImage'
        />
      <br />
      <input type="text" id="inputText" placeholder="Enter Your OTP" value={input} onChange={(e) => setInput(e.target.value)} />
      <br />{" "}
      <button
        onClick={submitForm}
        className='otp'
      >
        Submit
      </button>
    </div>
  );
};

export default TwoFactorAuth;
