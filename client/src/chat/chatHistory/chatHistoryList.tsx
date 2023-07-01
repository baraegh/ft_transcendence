import React, { useState, useEffect } from "react";
import { FilterBtn, Search, Settings } from "../tools/filterSearchSettings";
import '../chat';
import Axios from "axios";

const filterList = ['All chats', 'Friends', 'Groups'];
const settingsList = ['New Chat', 'Create Group', 'Invite'];

type ChatListHeaderProps = {
    setChat:        (chatId: string, chatImage: string, chatName: string,
                        chatType: string, userId: number | null) => void,
    searchQuery:    string,
    setSearchQuery: (searchQuery: string) => void,
    setFilter:      (filter: string) => void,
}

function ChatListHeader({setChat, searchQuery, setSearchQuery, setFilter} : ChatListHeaderProps)
{
    return (
        <div className="chat-list-header">

            <div className="title-options">
                <p>Chat</p>
                <Settings list={settingsList} setChat={setChat} />
            </div>
            <div className="filter-search">
                <FilterBtn list={filterList} setFilter={setFilter}/>
                <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
        </div>
    );
}

export const format = (str: string, n: number): string => {
    if (str.length > n)
        return str.substring(0, n) + '...';
    return str;
}

type HistoryListProps = {
    data:           channel,
    selected:       boolean
    setChat:        (chatId: string, chatImage: string,
                    chatName: string, chatType: string, userId: number | null) => void,
}

const HistoryList = ({data, setChat, selected}: HistoryListProps) =>
{
    const handleOnClick = () => {
        data.type === 'PERSONEL'?
                setChat(data.channelId, data.otherUserImage, data.otherUserName, data.type, data.otherUserId)
            :
                setChat(data.channelId, data.channelImage, data.channelImage, data.type, null);
    } 

    const isGroup = data.type !== 'PERSONEL';


    return (
        <div className={`item ${selected? 'selected': ''}`}
            onClick={handleOnClick}>
            <img src={isGroup? data.channelImage : data.otherUserImage} 
                alt={`${isGroup? data.channelName : data.otherUserName} image`}/>
            <div>
                <div className='item-username-group-status-circle'>
                    <p className="item-username-group">
                        {
                            isGroup?
                                format(data.channelName, 8)
                            : format(data.otherUserName, 8)
                        }
                    </p>
                    <div className='status-circle online'></div>
                </div>
                { 
                    data.lastMessage?
                        <p className="item-last-message">
                            {format(data.lastMessage.content, 17)}
                        </p>
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
    setChat:            (chatId: string, chatImage: string, chatName: string,
                        chatType: string, userId: number | null) => void,
    setIsProfileOpen:   (isOpen: boolean) => void,
    chatId:             string | null,
}

const ChatHistoryList = ( {setIsProfileOpen, setChat, chatId}: chatHistoryListProps) =>
{
    const [channelList, setChannelList] = useState<channel[]| null>(null);
    const [groupList, setGroupList] = useState<channel[]| null>(null);
    const [friendList, setFriendList] = useState<channel[]| null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('');
    let msgCard: React.ReactNode;

    useEffect(() => {
        let url: string = 'chat/all-channel-of-user';

        if (filter === 'Friends')
            url = 'chat/all-Personel-channel-of-user';
        else if (filter === 'Groups')
            url = 'chat/all-group-channel-of-user';

        Axios.get(`http://localhost:3000/${url}`, { withCredentials: true })
            .then((response) => {
                if (filter === '' || filter === 'All chats')
                    setChannelList(response.data);
                else if (filter === 'Friends')
                    setFriendList(response.data);
                else if (filter === 'Groups')
                    setGroupList(response.data);
            })
            .catch((error) => {
                    console.log(error);
                }
            );
    }, [chatId, searchQuery, filter]);

    const handleSetChat = (chatId: string,chatImage: string,
                            chatName: string, chatType: string,
                            userId: number | null) => {
        setChat(chatId, chatImage, chatName, chatType, userId);
        setIsProfileOpen(false);
    };

    let filtredChannelList: channel[] | null = null;
 
    if (filter === '' || filter === 'All chats')
    {
        filtredChannelList = channelList?.filter( channel => {
            if (channel.channelName)
                return channel.channelName.toLowerCase().includes(searchQuery.toLowerCase());
            else
                return channel.otherUserImage.toLowerCase().includes(searchQuery.toLowerCase());
        }) ?? null;
    }
    else if (filter === 'Friends')
    {
        filtredChannelList = friendList?.filter( channel => {
            if (channel.channelName)
                return channel.channelName.toLowerCase().includes(searchQuery.toLowerCase());
            else
                return channel.otherUserImage.toLowerCase().includes(searchQuery.toLowerCase());
        }) ?? null;
    }
    else if (filter === 'Groups')
    {
        filtredChannelList = groupList?.filter( channel => {
            if (channel.channelName)
                return channel.channelName.toLowerCase().includes(searchQuery.toLowerCase());
            else
                return channel.otherUserImage.toLowerCase().includes(searchQuery.toLowerCase());
        }) ?? null;
    }
        
    msgCard = filtredChannelList?
            filtredChannelList.map( channel =>
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
            <ChatListHeader setChat={handleSetChat} 
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            setFilter={setFilter}/>
            <div className="list-scroll">
                {msgCard}
            </div>
        </div>
    );
};

export default ChatHistoryList;