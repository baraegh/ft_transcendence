import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/inviteFriend.css'
import tvGif from '../img/giphy.gif'
import Header from '../tsx/header'
import { useNavigate, useParams } from 'react-router-dom';
import triangle from '../img/pngwing.com.png'
import { Search } from '../../chat/tools/filterSearchSettings'
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import von from 'https://cdn.intra.42.fr/users/5cbcbf356b9d010e3be665d85bf62ce0/brmohamm.jpg'
import axios from 'axios'
import Maps from './maps'


interface OtherUser {
    id: number;
    image: string;
    username: string;
    gameWon: number;
    gameLost: number;
    updatedAt: string;
    blocked: boolean;
    hosblocked: number;
    isRequested: boolean;
    isFriend: boolean;
    requestAccepted: boolean;
  }
  
  const otherUserTemplate: OtherUser = {
    id: 0,
    username: "string",
    image: "string",
    gameWon: 0,
    gameLost: 0,
    updatedAt: "2023-07-13T03:31:40.829Z",
    blocked: true,
    hosblocked: 0,
    isRequested: true,
    isFriend: true,
    requestAccepted: true
  };
  type meType = {
    id:           number,
    username:     string,
    image:        string,
    gameWon:      number,
    gameLost:     number,
    achievements: string[],
  }
  
  const userMe = React.createContext<meType | null>(null);

  function InviteFriend(): JSX.Element {
    const [me, setMe] = useState<meType | null>(null)

    const [searchQuery, setSearchQuery] = useState('');
    const [names, setNames] = useState<OtherUser[]>([]); // Update to use OtherUser type
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {withCredentials: true})
        .then((response) => {
          setMe(response.data);
        })
    }, []);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/is_all_online`, { withCredentials: true });
          const onlineUsers: string[] = res.data;
          const namePromises = onlineUsers.map(async (element: string) => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/other-profile/about/${element}`, { withCredentials: true });
            const userData: OtherUser = res.data; // Use the OtherUser type
            console.log(res.data);
            return userData;
          });
          const nameResults: OtherUser[] = await Promise.all(namePromises);
          setNames(nameResults);
        } catch (error) {
          console.log(error);
        }
      };
      console.log(names);
      fetchData();
    }, []);
  
    const filteredNames = names.filter((name) => {
      const lowercaseName = name.username.toLowerCase(); // Access the username property
      const lowercaseSearchQuery = searchQuery.toLowerCase();
      return lowercaseName.includes(lowercaseSearchQuery);
    });
    console.log(me?.id);
    return (
      <div>
        <Header />
        <div className="mainDisplay">
          <a onClick={() => { navigate('/home') }} id="X">X</a>
          <div className='search-input-container'>
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery}></Search>
          </div>item
          <div className='friendList'>
            {filteredNames.map((item) => (
              <div className='friendsSearch' key={item.id} onClick={() => { console.log(item.id) }}>
                <img className='friendsSearchImg' src={item.image} alt="" />
                <p onClick={() => {}}><Maps buttonText={item.username} id={item.id.toString()}/> </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default InviteFriend;