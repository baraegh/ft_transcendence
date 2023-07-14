import React, { useState, useEffect, useContext } from "react";
import { FilterBtn, Search } from "../tools/filterSearchSettings";
import groupImage from "../../assets/group.png";
import userImage from "../../assets/person.png";
import Axios from "axios";
import { chatInfoType } from "../chat";
import { Dialog } from "../tools/Dialog";
import { userMe } from "../../App";
import { Popover } from "@radix-ui/react-popover";
import PopoverComp from "../tools/popover";
import defaultGroupImage from '../../assets/group.png';
import { format } from "../chatHistory/chatHistoryList";
import { SocketContext } from "../../socket/socketContext";

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
    group:  groupDataType,
    flag?:   boolean,
}

export const GroupCard = ({group, flag} : GroupCardProps) => {

    return (
            <div className="friend-card">
                <img    src={group.image? group.image: groupImage} 
                        alt={group.name + " profile's image"}/>
                <p>{flag? format(group.name, 3): format(group.name, 10)}</p>
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

type GroupCardPopOverContentProps = {
    group:      groupDataType,
    setChat?:   (Id: string, Image: string, Name: string,
                Type: string, userId: number | null) => void,  
    chatInfo:   chatInfoType;
    setUpdate:  (update: boolean) => void,
    update:     boolean,
}

const GroupCardPopOverContent = ({ group, setChat, chatInfo, setUpdate, update} : GroupCardPopOverContentProps) => {
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [isMuteDialogOpen, setIsMuteDialogOpen] = useState(false);
    const [groupData, setGroupData] = useState<groupDataType>({
        id: '',
        type: '',
        name: '',
        image: '',
    });
    const [isJoinOpen, setIsJoinOpen] = useState(false);
    const {socket} = useContext<any | undefined>(SocketContext);

    const joinRoom = (channelId: string) =>{
        if (socket) {
            socket.emit('joinRoom', channelId);
            console.log("join");
        }
    }

    const handleJoinGroup = () => {
        setIsJoinOpen(true);
        if (group.type === 'PUBLIC')
        {
            Axios.post("http://localhost:3000/chat/join-group",
                {   
                    channelId:  group.id,
                    password:   '',
                },
                {withCredentials: true})
            .then((response) => {
                console.log('response: ', response);
                if (setChat)
                    setChat(group.id, group.image, 
                            group.name, group.type, null);
                joinRoom(group.id);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    return (
        <div className="user-card-popover-content" style={{width: '110px'}}>
            <GroupCard group={group} flag={true}/>
            <div className="user-card-btn">
                <button onClick={handleJoinGroup}>Join</button>
            </div>
            {
                isJoinOpen && group.type === 'PROTECTED' &&  
                <Dialog title="Join group" 
                        closeDialog={() => setIsJoinOpen(false)}
                        setChat={setChat}
                        chatInfo={{chatId: group.id, chatName: group.name,
                                    chatImage: group.image, chatType: group.type,
                                    chatUserId: null, blocked: false, whoblock: null, mute: 'NAN'}}/>
            }
        </div>
    );
}

const filterList = ['All Friends', 'All Groups', 'All Users',  'Online', 'Block', 'Pending'];

type friendListProps = {
    setChat:    (Id: string, Image: string, Name: string,
                    Type: string, userId: number | null,
                    blocked?: boolean, whoblock?: number | null) => void,
    chatInfo:   chatInfoType,
    update:     boolean,
    setUpdate:  (update: boolean) => void,
}

export const FriendList = ({setChat, chatInfo, update, setUpdate} : friendListProps) => {
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
        {
            console.log('all groups')
            url = 'chat/show-all-groups';
        }
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
                : <p className="No-data" style={{textAlign: 'center'}}>NO FRIENDS</p> ;
    }
    else if (filter === 'All Groups')
    {
        const filteredGroupList = groupListArray?.filter(group =>
                group.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

        List =  filteredGroupList ?
                    filteredGroupList.map(group =>
                        {
                            return <PopoverComp Trigger={<GroupCard group={group}/>}
                                                Content={<GroupCardPopOverContent   group={group}
                                                                                    setChat={setChat}
                                                                                    chatInfo={chatInfo}
                                                                                    update={update}
                                                                                    setUpdate={setUpdate}/>}
                                                key={group.id}/>
                        }
                        
                )
                : <p className="No-data" style={{textAlign: 'center'}}>NO GROUPS</p>;
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
                : <p className="No-data" style={{textAlign: 'center'}}>NO USERS</p> ;
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
                : <p className="No-data" style={{textAlign: 'center'}}>NO USERS</p> ;
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
                : <p className="No-data" style={{textAlign: 'center'}}>NO USERS</p> ;
    }
    else
        List = <p className="No-data" style={{textAlign: 'center'}}>NO DATA</p>

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
