import React, { useState, useEffect, useContext } from "react";
import { FilterBtn, Search, Settings } from "../tools/filterSearchSettings";
import '../chat';
import Axios from "axios";
import defaultUserImage from '../../assets/person.png';
import defaultGroupImage from '../../assets/group.png';
import { chatInfoType, formatDate } from "../chat";
import { userMe } from "../../App";
import { SocketContext } from "../../socket/socketContext";

const filterList = ['All chats', 'Friends', 'Groups'];
const settingsList = ['New Chat', 'Create Group'];

type ChatListHeaderProps = {
    setChat:        (chatId: string, chatImage: string, chatName: string,
                        chatType: string, userId: number | null) => void,
    searchQuery:    string,
    setSearchQuery: (searchQuery: string) => void,
    setFilter:      (filter: string) => void,
    joinRoom:       (channelId: string) => void,
    setUpdateGroup: (update: boolean) => void,
    updateGroup:    boolean,
}

function ChatListHeader({setChat, searchQuery, setSearchQuery,
                        setFilter, joinRoom, setUpdateGroup,
                        updateGroup} : ChatListHeaderProps)
{
    return (
        <div className="chat-list-header">

            <div className="title-options">
                <p>Chat</p>
                <Settings   list={settingsList}
                            setChat={setChat}
                            joinRoom={joinRoom}
                            setUpdateGroup={setUpdateGroup}
                            updateGroup={updateGroup}/>
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
    data:               channel,
    selected:           boolean
    setChat:            (chatId: string, chatImage: string, chatName: string,
                            chatType: string, userId: number | null,
                            blocked?: boolean, whoblock?: number | null,
                            muted?: string) => void,
    updateGroup:        boolean,
    setUpdateGroup:     (update: boolean) => void,
    chatInfo:           chatInfoType,
    leaveRoom:          () => void,
    joinRoom:           (channelId: string) => void,
    openChatGroupArea:  (open: boolean) => void,
}

const HistoryList = ({data, setChat, selected, updateGroup,
                        setUpdateGroup, chatInfo, leaveRoom,
                        joinRoom, openChatGroupArea}: HistoryListProps) => {
    const isGroup = data.type !== 'PERSONEL';
    const [isOnline, setIsOnline] = useState(true);
        

    useEffect(() => {
        let intervalId : number | undefined;
      
        const fetchData = () => {
          if (isGroup) {
            return;
          }

          Axios.get(`http://localhost:3000/user/isonline/${data.otherUserId}`, { withCredentials: true })
            .then((response) => {
                setIsOnline(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        };
      
        intervalId = setInterval(fetchData, 1000);
        return () => {
          clearInterval(intervalId);
        };
      }, []);

    const handleOnClick = () => {
        if (chatInfo.chatId !== '')
            leaveRoom();
        joinRoom(data.channelId);
        if (data.type === 'PERSONEL')
        {
            setChat(data.channelId,
                    data.otherUserImage? data.otherUserImage: defaultUserImage,
                    data.otherUserName, data.type, data.otherUserId, data.blocked,
                    data.hasblocked);
        }
        else
        {
            setChat(data.channelId,
                    data.channelImage? data.channelImage : defaultGroupImage,
                    data.channelName, data.type, null, false, null, data.mut);
            openChatGroupArea(true);
            setUpdateGroup(!updateGroup)
        }
    } 

    return (
        <div className={`item ${selected? 'selected': ''}`}
            onClick={handleOnClick}>
            <img src={
                        isGroup? 
                            (data.channelImage? data.channelImage : defaultGroupImage) 
                        : (data.otherUserImage? data.otherUserImage: defaultUserImage)} 
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
                    {isGroup? '': <div className={'status-circle ' + (isOnline?
                                                                        'online' 
                                                                    : 'offline')}></div>}
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
               {data.lastMessage? <p>{formatDate(data.lastMessage.timeSent)}</p> : ''}
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
            messageId:      string,
            content:        string,
            timeSent:       string,
            senderId:       number,
        },
    blocked:        boolean,
    hasblocked:     number,
    mut:            string,
}

type chatHistoryListProps =
{
    setChat:            (chatId: string, chatImage: string, chatName: string,
                        chatType: string, userId: number | null,
                        blocked?: boolean, whoblock?: number | null,
                        muted?: string) => void,
    setIsProfileOpen:   (isOpen: boolean) => void,
    chatInfo:           chatInfoType,
    setRole:            (role: string) => void;
    setUpdateGroup:     (update: boolean) => void,
    updateGroup:        boolean,
    updateChatInfo:     boolean,
    updateUserCard:     boolean,
    leaveRoom:          () => void,
    openChatGroupArea:  (open: boolean) => void,
}

const ChatHistoryList = ( {setIsProfileOpen, setChat, chatInfo,
                            setRole, setUpdateGroup, updateGroup,
                            updateChatInfo, updateUserCard, leaveRoom,
                            openChatGroupArea}: chatHistoryListProps) =>
{
    const [channelList, setChannelList] = useState<channel[]| null>(null);
    const [groupList, setGroupList] = useState<channel[]| null>(null);
    const [friendList, setFriendList] = useState<channel[]| null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('');
    let   msgCard: React.ReactNode;
    const {socket} = useContext<any | undefined>(SocketContext);

    const joinRoom = (channelId: string) =>{
        if (socket) {
            socket.emit('joinRoom', channelId);
            console.log("join");
        }
    }

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
            }, [chatInfo, searchQuery, filter,
                    updateChatInfo, updateUserCard]);
            
    useEffect(() => {
        if (chatInfo.chatId === '' ||
            chatInfo.chatId === undefined ||
            chatInfo.chatType === 'PERSONEL')
            return;
        Axios.get(`http://localhost:3000/chat/roleOfuser/${chatInfo.chatId}`,
                { withCredentials: true })
            .then((response) => {
                setRole(response.data.toLowerCase());
            })
            .catch((error) => {
                    console.log(error);
                }
            );
    }, [chatInfo.chatId]);

    const handleSetChat = (chatId: string,chatImage: string, chatName: string,
                            chatType: string, userId: number | null,  blocked?: boolean,
                            whoblock?: number | null,  muted?: string) => {
        setChat(chatId, chatImage, chatName, chatType,
                    userId, blocked, whoblock, muted);
        setIsProfileOpen(false);
    };

    let filteredChannelList: channel[] | null = null;
 
    if (filter === '' || filter === 'All chats')
    {
        filteredChannelList = channelList?.filter( (channel) => {
            if (channel.channelName)
                return channel.channelName.toLowerCase().includes(searchQuery.toLowerCase());
            else
                return channel.otherUserName.toLowerCase().includes(searchQuery.toLowerCase());
        }) ?? null;
    }
    else if (filter === 'Friends')
    {
        filteredChannelList = friendList?.filter( (channel) => {
            if (channel.channelName)
                return channel.channelName.toLowerCase().includes(searchQuery.toLowerCase());
            else
                return channel.otherUserName.toLowerCase().includes(searchQuery.toLowerCase());
        }) ?? null;
    }
    else if (filter === 'Groups')
    {
        filteredChannelList = groupList?.filter( (channel) => {
            if (channel.channelName)
                return channel.channelName.toLowerCase().includes(searchQuery.toLowerCase());
            else
                return channel.otherUserName.toLowerCase().includes(searchQuery.toLowerCase());
        }) ?? null;
    }

    msgCard = filteredChannelList ?
            filteredChannelList.map( (channel) => {
                return <HistoryList key={channel.channelId}
                                    data={channel}
                                    selected={chatInfo.chatId === channel.channelId}
                                    setChat={setChat}
                                    setUpdateGroup={setUpdateGroup}
                                    updateGroup={updateGroup}
                                    chatInfo={chatInfo}
                                    leaveRoom={leaveRoom}
                                    joinRoom={joinRoom}
                                    openChatGroupArea={openChatGroupArea}/>
            })
        : <p className="No-data" style={{textAlign: 'center'}}>No Channel</p>

    return (
        <div className="chat-history-list">
            <ChatListHeader setChat={handleSetChat} 
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            setFilter={setFilter}
                            joinRoom={joinRoom}
                            setUpdateGroup={setUpdateGroup}
                            updateGroup={updateGroup}/>
            <div className="list-scroll">
                {msgCard}
            </div>
        </div>
    );
};

export default ChatHistoryList;