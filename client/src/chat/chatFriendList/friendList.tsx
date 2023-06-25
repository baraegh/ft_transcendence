import React, { useState, useEffect } from "react";
import { FilterBtn, Search } from "../tools/filterSearchSettings";
import Axios from "axios";

export type friendDataType = {
    blocked:            boolean,
    isRequested:        boolean,
    isFriend:           boolean,
    requestAccepted:    boolean,
    friend:             {
        id: number,
        username: string,
        image: string   
    }
}

type FriendCardProps = {
    friend: friendDataType,
}

export const FriendCard = ({friend} : FriendCardProps) => {

    return (
            <div className="friend-card">
                <img src={friend.friend.image} alt={friend.friend.username + " profile's image"}/>
                <p>{friend.friend.username}</p>
            </div>
    );
}

const filterList = ['All Friends', 'Online', 'Block', 'Pending'];

export const FriendList = () => {
    const [friendListArray, setFriendListArray] = useState<friendDataType[] | null>(null);
    useEffect(() => {
        Axios.get('http://localhost:3000/user/friends', { withCredentials: true })
            .then((response) => {
                    setFriendListArray(response.data);
                    console.log('response.data: ', response.data);
            })
            .catch((error) => {
                    console.log(error);
                }
            );
    }, []);

    let friendsList =   friendListArray? 
                            friendListArray.map(friend => 
                                    <FriendCard 
                                        key={friend.friend.id} 
                                        friend={friend}/>)
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
