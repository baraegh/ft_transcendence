import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/inviteFriend.css'
import tvGif from '../img/giphy.gif'
import Header from '../tsx/header'
import { useNavigate } from 'react-router-dom';
import triangle from '../img/pngwing.com.png'
import { Search } from '../../chat/tools/filterSearchSettings'

function InviteFriend(): JSX.Element {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {

    }, []);

    const list = ['a', 'b', 'c', 'd'];

    const filtredList = list.filter((item) => {
        return item.toLowerCase().includes(searchQuery.toLowerCase())
    })

    return (<div>
        <Header />
        <div className="mainDisplay">
            <a onClick={() => { navigate('/home') }} id="X" >X</a>
            <div className='IQ'>
                <div className="inviteFriendContainer">
                    <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
                <div>
                    {
                        filtredList.map((item) => {
                                return <p>{item}</p>
                        })
                    }
                <div/>
            </div>
        </div>
    </div>
    </div>)
}

export default InviteFriend;