import React, { useState, useEffect } from "react";
import { FilterBtn, Search, Settings } from "../tools/filterSearchSettings";
import '../chat';
import Axios from "axios";

const filterList = ['All chats', 'Friends', 'Groups'];
const settingsList = ['New Chat', 'Create Group', 'Invite'];

type ChatListHeaderProps = {
    setChat: (chatId: string, chatImage: string, chatName: string, chatType: string) => void,
}

function ChatListHeader({setChat} : ChatListHeaderProps)
{
    return (
        <div className="chat-list-header">

            <div className="title-options">
                <p>Chat</p>
                <Settings list={settingsList} setChat={setChat} />
            </div>
            <div className="filter-search">
                <FilterBtn list={filterList} />
                <Search />
            </div>
        </div>
    );
}

type HistoryListProps = {
    data:           channel,
    selected:       boolean
    setChat:        (chatId: string, chatImage: string, chatName: string, chatType: string) => void,
}

const HistoryList = ({data, setChat, selected}: HistoryListProps) =>
{
    const handleOnClick = () => {
        data.type === 'PERSONEL'?
                setChat(data.channelId, data.otherUserImage, data.otherUserName, data.type)
            :
                setChat(data.channelId, data.channelImage, data.channelImage, data.type);
    } 

    const isGroup = data.type === 'PRIVATE';

    return (
        <div className={`item ${selected? 'selected': ''}`}
            onClick={handleOnClick}>
            <img src={isGroup? data.channelImage : data.otherUserImage} 
                alt={`${isGroup? data.channelName : data.otherUserName} image`}/>
            <div>
                <div className='item-username-group-status-circle'>
                    <p className="item-username-group">{isGroup? data.channelName : data.otherUserName}</p>
                    <div className='status-circle online'></div>
                </div>
                { 
                    data.lastMessage?
                        <p className="item-last-message">{data.lastMessage.content}</p>
                    : ''
                }
            </div>
            <div className="item-time">
               {data.lastMessage? <p>{data.lastMessage.timeSent}</p> : ''}
            </div>
        </div>
    );
}


export type channel = {
    channelId:      string,
    type:           string,
    updatedAt:      string,
    otherUserId:    number,
    otherUserName:  string,
    otherUserImage: string,
    channelName:    string,
    channelImage:   string,
    lastMessage:    {
        messageId:  string,
        content:    string,
        timeSent:   string,
        senderId:   number,
    },   
}

type chatHistoryListProps =
{
    setChat:            (chatId: string, chatImage: string, chatName: string, chatType: string) => void,
    setIsProfileOpen:   (isOpen: boolean) => void,
    chatId:             string | null,
}

const ChatHistoryList = ( {setIsProfileOpen, setChat, chatId}: chatHistoryListProps) =>
{
    // const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [channelList, setChannelList] = useState<channel[]| null>(null);

    useEffect(() => {
        Axios.get('http://localhost:3000/chat/all-channel-of-user', { withCredentials: true })
            .then((response) => {
                setChannelList(response.data);
            })
            .catch((error) => {
                    console.log(error);
                }
            );
    }, [chatId]);

    const handleSetChat = (chatId: string,chatImage: string,
                            chatName: string, chatType: string) => {
        setChat(chatId, chatImage, chatName, chatType);
        setIsProfileOpen(false);
    };

    const msgCard = channelList? channelList.map( channel =>
                                (
                                    <HistoryList
                                        key={channel.channelId}
                                        data={channel}
                                        selected={chatId === channel.channelId}
                                        setChat={setChat}
                                    />
                                ))
                    : <p>No Channels</p>

    return (
        <div className="chat-history-list">
            <ChatListHeader setChat={handleSetChat} />
            <div className="list-scroll">
                {msgCard}
            </div>
        </div>
    );
};

export default ChatHistoryList;