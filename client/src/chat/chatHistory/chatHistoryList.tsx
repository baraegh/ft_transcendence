import React, { useState } from "react";
import { FilterBtn, Search, Settings } from "../tools/filterSearchSettings";
import '../chat';
import Image from '../barae.jpg';
import { friendDataType } from "../chatFriendList/friendList";

const filterList = ['All chats', 'Friends', 'Groups'];
const settingsList = ['New Chat', 'Create Group', 'Invite'];

function ChatListHeader()
{
    return (
        <div className="chat-list-header">

            <div className="title-options">
                <p>Chat</p>
                <Settings list={settingsList}/>
            </div>
            <div className="filter-search">
                <FilterBtn list={filterList} />
                <Search />
            </div>
        </div>
    );
}

type Object = {
    id: number
    img: string,
    desciption: string,
    name: string,
    msg: string,
    time: string,
    setChatId: (chatId: number)=> void,
    selected: boolean
}

const HistoryList = (props: Object) =>
{
    const handleOnClick = () => {
        props.setChatId(props.id)
    } 

    return (
        <div className={`item ${props.selected? 'selected': ''}`}
            onClick={handleOnClick}>
            <img src={props.img} alt={props.desciption}/>
            <div>
                <div className='item-username-group-status-circle'>
                    <p className="item-username-group">{props.name}</p>
                    <div className='status-circle online'></div>
                </div>
                <p className="item-last-message">{props.msg}</p>
            </div>
            <div className="item-time">
                <p>{props.time}</p>
            </div>
        </div>
    );
}

const array = [
    {id: 0,  chatId:0 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "Just now"}, 
    {id: 1,  chatId:1 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 2,  chatId:2 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 3,  chatId:3 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 4,  chatId:4 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 5,  chatId:5 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 6,  chatId:6 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 7,  chatId:7 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 8,  chatId:8 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 9,  chatId:9 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 10, chatId:10 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 11, chatId:11 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 12, chatId:12 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 13, chatId:13 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 14, chatId:14 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 15, chatId:15 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 16, chatId:16 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 17, chatId:17 , img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 18, chatId:18, img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 19, chatId:19, img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 20, chatId:20, img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 21, chatId:21, img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 22, chatId:22, img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 23, chatId:23, img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 24, chatId:24, img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 25, chatId:25, img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 26, chatId:26, img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
    {id: 27, chatId:27, img: Image, desciption: "profile img" , name: "barae", msg: "test test", time: "1 min"},
];

type chatHistoryListProps =
{
    setChatId:          (chatId: number)=> void,
    setIsProfileOpen:   (isOpen: boolean) => void,
}

function ChatHistoryList( {setChatId, setIsProfileOpen}: chatHistoryListProps)
{
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

    const handleSetChatId = (chatId: number) => {
        setSelectedChatId(chatId);
        setChatId(chatId);
        setIsProfileOpen(false);
    };

    const msgCard = array.map( o =>
        <HistoryList
            key={o.id}
            id={o.chatId}
            img={o.img}
            desciption={o.desciption}
            name={o.name}
            msg={o.msg}
            time={o.time}
            setChatId={handleSetChatId}
            selected={selectedChatId === o.chatId}
        />
    );

    return (
        <div className="chat-history-list">
            <ChatListHeader />
            <div className="list-scroll">
                {msgCard}
            </div>
        </div>
    );
};

export default ChatHistoryList;