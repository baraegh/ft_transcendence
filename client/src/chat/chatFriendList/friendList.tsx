import React, { useState, useEffect } from "react";
import { FilterBtn, Search } from "../tools/filterSearchSettings";
import groupImage from "../../assets/group.png";
import userImage from "../../assets/person.png";
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
                <img    src={friend.friend.image? friend.friend.image: userImage}
                        alt={friend.friend.username + " profile's image"}/>
                <p>{friend.friend.username}</p>
            </div>
    );
}

type groupDataType = {
    id:     string,
    type:   string,
    name:   string,
    image:  string,
}

type GroupCardProps= {
    group: groupDataType,
}

export const GroupCard = ({group} : GroupCardProps) => {

    return (
            <div className="friend-card">
                <img    src={group.image? group.image: groupImage} 
                        alt={group.name + " profile's image"}/>
                <p>{group.name}</p>
            </div>
    );
}

type userDataType = {
    id:         number,
    image:      string,
    username:   string,
}


type UserCardProps = {
    user:   userDataType,
}

export const UserCard = ({user} : UserCardProps) => {

    return (
            <div className="friend-card">
                <img    src={user.image? user.image: userImage}
                        alt={user.username + " profile's image"}/>
                <p>{user.username}</p>
            </div>
    );
}



const filterList = ['All Friends', 'All Groups', 'All Users',  'Online', 'Block', 'Pending'];

export const FriendList = () => {
    const [friendListArray, setFriendListArray] = useState<friendDataType[] | null>(null);
    const [groupListArray, setGroupListArray] = useState<groupDataType[] | null>(null);
    const [usersListArray, setUsersListArray] = useState<userDataType[] | null>(null);
    const [blockedList, setBlockedList] = useState<userDataType[] | null>(null);
    const [pendingList, setPendingList] = useState<userDataType[] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('');
    let List: React.ReactNode;

    useEffect(() => {
        let url: string = 'user/friends';

        if (filter === 'All Friends' || filter === '')
            url = 'user/friends';
        else if (filter === 'All Groups')
            url = 'chat/show-all-groups';
        else if (filter === 'All Users')
            url = 'chat/show-all-users';
        else if (filter === 'Block')
            url = 'chat/friend/filter/block';
        else if (filter === 'Pending')
            url = 'chat/friend/filter/pending';
        else // online: to be fixed
            return;

        Axios.get(`http://localhost:3000/${url}`, { withCredentials: true })
            .then((response) => {
                if (url === 'user/friends')
                    setFriendListArray(response.data);
                else if (url === 'chat/show-all-groups')
                    setGroupListArray(response.data);
                else if (url === 'chat/show-all-users')
                    setUsersListArray(response.data);
                else if (url == 'chat/friend/filter/block')
                    setBlockedList(response.data);
                else if (url === 'chat/friend/filter/pending')
                    setPendingList(response.data);
            })
            .catch((error) => {
                    console.log(error);
                }
            );

    }, [filter, searchQuery]);

    if (filter === 'All Friends' || filter === '')
    {
        const filteredFriendListArray = friendListArray?.filter(friend =>
                friend.friend.username.toLowerCase().includes(searchQuery.toLowerCase())
            );

        List =  filteredFriendListArray?
                    filteredFriendListArray.map(friend => 
                        <FriendCard 
                            key={friend.friend.id} 
                            friend={friend}/>)
                : <p>NO FRIENDS</p> ;
    }
    else if (filter === 'All Groups')
    {
        const filteredGroupList = groupListArray?.filter(group =>
                group.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

        List =  filteredGroupList ?
                    filteredGroupList.map(group =>
                        <GroupCard 
                            key={group.id}
                            group={group}/>)
                : <p>NO GROUPS</p>;
    }
    else if (filter === 'All Users')
    {
        const filtredUsersList =  usersListArray?.filter(user => 
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
        List =  filtredUsersList?
                    filtredUsersList.map(user => 
                        <UserCard 
                            key={user.id} 
                            user={user}/>)
                : <p>NO USERS</p> ;
    }
    else if (filter === 'Block')
    {
        const filtredBlockedList =  blockedList?.filter(user => 
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
        List =  filtredBlockedList?
                    filtredBlockedList.map(user => 
                        <UserCard 
                            key={user.id} 
                            user={user}/>)
                : <p>NO USERS</p> ;
    }
    else if (filter === 'Pending')
    {
        const filtredpendingList =  pendingList?.filter(user => 
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
        List =  filtredpendingList?
                    filtredpendingList.map(user => 
                        <UserCard 
                            key={user.id} 
                            user={user}/>)
                : <p>NO USERS</p> ;
    }
    else
        List = <p>NO DATA</p>

    return (
        <div className="friends-list">
           <div className="friends-list-header">
                <div className="title-options">
                    <p>Friends</p>
                </div>
                <div className="filter-search friend-filter-search">
                    <FilterBtn list={filterList} setFilter={setFilter} />
                    <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
            </div>
            <div className="list-scroll">
                {List}
            </div>
        </div>
    );
}
