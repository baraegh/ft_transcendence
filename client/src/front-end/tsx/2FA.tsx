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

function FA() : JSX.Element {
    const [profile, setProfile] = useState("");
    const [input, setInput] = useState("");
    const queryParams = new URLSearchParams(window.location.search);
    const imageParam = queryParams.get("image");
    const navigate = useNavigate();
    const [logo, setLogo] = useState(imageParam);
    const [error, setError] = useState("");

    const submitInput = (event: KeyboardEvent) => {
        console.log(input)

      axios.post('http://localhost:3000/2fa/verified', { "secret": input }, { withCredentials: true })
        .then(res => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          if (err.code === "ERR_BAD_REQUEST") {
            setError("Wrong Auth Code !");
          }
        });
  
      event.preventDefault();
      setError("");
      if (input.length !== 6) {
        setError("error akhay");
      }
  

    };
  

    useEffect(() => {
        axios.get("http://localhost:3000/user/me", { withCredentials: true })
          .then((response) => setProfile(response.data))
          .catch((error) => {
            console.log(error);
          });
        }, []);
        // console.log(input);
    return (

        <div className="mainDiv">
            <img src={profile.image} className="UserImage" />
            <p className='userName'>{profile.username}</p>
            <form onSubmit={submitInput}>
            <input placeholder='OTP' type="tel" className="otp" value={input}  onChange={(e) => setInput(e.target.value)} />
                {error && <p id='Error_message'>{error}</p>}
            </form>
        </div>

    );
}

export default FA;