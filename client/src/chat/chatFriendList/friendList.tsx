import React, { useState, useEffect } from "react";
import { FilterBtn, Search } from "../tools/filterSearchSettings";
import Axios from "axios";

export const FriendCard = (props : {id: number, img: string, username:string}) => {

    return (
            <div className="friend-card">
                <img src={props.img} alt={props.username + " profile's image"}/>
                <p>{props.username}</p>
            </div>
    );
}

const filterList = ['All Friends', 'Online', 'Block', 'Pending'];

export type friendDataType = {
    id: number,
    username: string,
    image: string
}

export const FriendList = () => {
    const [friendListArray, setFriendListArray] = useState<friendDataType[] | null>(null);
    useEffect(() => {
        Axios.get('http://localhost:3000/user/friends', { withCredentials: true })
            .then((response) => {
                    setFriendListArray(response.data);
            })
            .catch((error) => {
                    console.log(error);
                }
            );
    }, []);

    let friendsList =   friendListArray? 
                            friendListArray.map(friend => 
                                    <FriendCard 
                                        key={friend.id} 
                                        id={friend.id}
                                        img={friend.image} 
                                        username={friend.username}/>)
                        : <p>NO FRIENDS</p>;

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
