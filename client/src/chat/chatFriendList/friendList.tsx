import React, { useState } from "react";
import { FilterBtn, Search } from "../tools/filterSearchSettings";

import Image from '../barae.jpg';

const array = [
    {id: 0, img:Image, username:"BARAE"}, 
    {id: 1, img: Image, username:"BARAE"},
    {id: 2, img: Image, username:"BARAE"},
    {id: 3, img: Image, username:"BARAE"},
    {id: 4, img: Image, username:"BARAE"},
    {id: 5, img: Image, username:"BARAE"},
    {id: 6, img: Image, username:"BARAE"},
    {id: 7, img: Image, username:"BARAE"},
    {id: 8, img: Image, username:"BARAE"},
    {id: 9, img: Image, username:"BARAE"},
    {id: 10, img: Image, username:"BARAE"},
    {id: 11, img: Image, username:"BARAE"},
    {id: 12, img: Image, username:"BARAE"},
    {id: 13, img: Image, username:"BARAE"},
    {id: 14, img: Image, username:"BARAE"},
    {id: 15, img: Image, username:"BARAE"},
    {id: 16, img: Image, username:"BARAE"},
    {id: 17, img: Image, username:"BARAE"},
    {id: 18, img: Image, username:"BARAE"},
    {id: 19, img: Image, username:"BARAE"},
    {id: 20, img: Image, username:"BARAE"},
    {id: 21, img: Image, username:"BARAE"},
    {id: 22, img: Image, username:"BARAE"},
    {id: 23, img: Image, username:"BARAE"},
    {id: 24, img: Image, username:"BARAE"},
    {id: 25, img: Image, username:"BARAE"},
    {id: 26, img: Image, username:"BARAE"},
    {id: 27, img: Image, username:"BARAE"},
    {id: 28, img: Image, username:"BARAE"},
    {id: 29, img: Image, username:"BARAE"},
    {id: 30, img: Image, username:"BARAE"},
    {id: 31, img: Image, username:"BARAE"},
    {id: 32, img: Image, username:"BARAE"},
    {id: 33, img: Image, username:"BARAE"},
    {id: 34, img: Image, username:"BARAE"},
    {id: 35, img: Image, username:"BARAE"},
    {id: 36, img: Image, username:"BARAE"},
    {id: 37, img: Image, username:"BARAE"},
    {id: 38, img: Image, username:"BARAE"},
    {id: 39, img: Image, username:"BARAE"},


];

export const FriendCard = (props : {img: string, username:string}) => {

    return (
            <div className="friend-card">
                <img src={props.img} alt={props.username + 'image'}/>
                <p>{props.username}</p>
            </div>
    );
}

const filterList = ['All Friends', 'Online', 'Block', 'Pending'];

export const FriendList = () => {
    const friendsList = array.map(e => <FriendCard key={e.id} img={e.img} username={e.username}/>);

    return (
        <div className="friends-list">
           <div className="friends-list-header">
                <div className="title-options">
                    <p>Friends</p>
                </div>
                <div className="filter-search friend-filter-search">
                    <FilterBtn list={filterList} />
                    <Search />
                </div>
            </div>
            <div className="list-scroll">
                {friendsList}
            </div>
        </div>
    );
}
