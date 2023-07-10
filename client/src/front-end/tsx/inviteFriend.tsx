import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/inviteFriend.css'
import tvGif from '../img/giphy.gif'
import Header from '../tsx/header'
import { useNavigate } from 'react-router-dom';
import triangle from '../img/pngwing.com.png'
import { Search } from '../../chat/tools/filterSearchSettings'
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import von from 'https://cdn.intra.42.fr/users/5cbcbf356b9d010e3be665d85bf62ce0/brmohamm.jpg'



function InviteFriend(): JSX.Element {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {

    }, []);

    const list = [
     ['barae', 'https://cdn.intra.42.fr/users/56b6ef5fd87645cbc5179e01683d4b80/eel-ghan.jpg'],
      ['rimney', 'https://cdn.intra.42.fr/users/5cbcbf356b9d010e3be665d85bf62ce0/rimney.jpg'],
       ['mohammed', 'https://cdn.intra.42.fr/users/49c9f954c68d136b2b41e8da9fbd4f30/mait-aad.jpg'],
     ['barae', 'https://cdn.intra.42.fr/users/56b6ef5fd87645cbc5179e01683d4b80/eel-ghan.jpg'],
      ['rimney', 'https://cdn.intra.42.fr/users/5cbcbf356b9d010e3be665d85bf62ce0/rimney.jpg'],
       ['mohammed', 'https://cdn.intra.42.fr/users/49c9f954c68d136b2b41e8da9fbd4f30/mait-aad.jpg'],
     ['barae', 'https://cdn.intra.42.fr/users/56b6ef5fd87645cbc5179e01683d4b80/eel-ghan.jpg'],
      ['rimney', 'https://cdn.intra.42.fr/users/5cbcbf356b9d010e3be665d85bf62ce0/rimney.jpg'],
       ['mohammed', 'https://cdn.intra.42.fr/users/49c9f954c68d136b2b41e8da9fbd4f30/mait-aad.jpg'],
     ['barae', 'https://cdn.intra.42.fr/users/56b6ef5fd87645cbc5179e01683d4b80/eel-ghan.jpg'],
      ['rimney', 'https://cdn.intra.42.fr/users/5cbcbf356b9d010e3be665d85bf62ce0/rimney.jpg'],
       ['mohammed', 'https://cdn.intra.42.fr/users/49c9f954c68d136b2b41e8da9fbd4f30/mait-aad.jpg'],
     ['barae', 'https://cdn.intra.42.fr/users/56b6ef5fd87645cbc5179e01683d4b80/eel-ghan.jpg'],
      ['rimney', 'https://cdn.intra.42.fr/users/5cbcbf356b9d010e3be665d85bf62ce0/rimney.jpg'],
       ['mohammed', 'https://cdn.intra.42.fr/users/49c9f954c68d136b2b41e8da9fbd4f30/mait-aad.jpg']
    ];

    
    const names = list.filter((name) => {
      const lowercaseName = name[0].toLowerCase(); // Convert the name to lowercase for comparison
      const lowercaseSearchQuery = searchQuery.toLowerCase();
      return   lowercaseName.includes(lowercaseSearchQuery);
    });

    return (<div>
        <Header />
        <div className="mainDisplay">
            <a onClick={() => { navigate('/home') }} id="X" >X</a>
            <div className='search-input-container'>
                <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
                {/* {searchBar()}; */}
                {/* <div className="inviteFriendContainer">
                </div> */}
                <div className='friendList'>
                    {
                        names.map((item) => {
                            return (
                                <div className='friendsSearch'>
                                <img className='friendsSearchImg' src={item[1]} alt="" />
                            <p>{item[0]}</p>
                            </div>)
                        })
                    }
                </div>
            </div>
        </div>)
}

export default InviteFriend;