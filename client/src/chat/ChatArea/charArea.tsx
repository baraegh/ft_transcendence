import React, {useState, useEffect} from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faKhanda, faXmark, faGear} from '@fortawesome/free-solid-svg-icons';
import {SendOutlined} from '@ant-design/icons';
import { Settings, Search } from "../tools/filterSearchSettings";
import { FriendCard } from "../chatFriendList/friendList";
import { CreateGroupFirstDialog } from "../tools/Dialog";
import PopoverComp from "../tools/popover";
import { Dialog } from "../tools/Dialog";
import "./chatArea.css"

import Image from '../barae.jpg';

type msgCard = {userId: number, content: string, timeSend: string, image?: string}
export type msgListType = msgCard[];

const settingsList = ['Profile', 'Delete', 'Block'];

type chatAreaHeaderProps =
{
    type:               string | null,
    chatImage:          string | null,
    chatName:          string | null,
    setIsProfileOpen:   (isopen: boolean) => void;
}

const ChatAreaHeader = ({setIsProfileOpen, type, chatImage, chatName} : chatAreaHeaderProps) => {

    return (
        <div className='chat-area-header'>
            <div className="user-card">
                <img src={chatImage? chatImage: 'deafault image'} alt={`${chatName} image`}/>
                <div>
                    <p className="user-card-username">{chatName}</p>
                    <p className="user-card-status">active</p>
                </div>
            </div>
            <div className="challenge-setting">
                {
                    (type === 'PERSONEL') ?
                        <button className="challenge-btn">
                            <p>Challenge</p>
                            <FontAwesomeIcon icon={faKhanda} style={{color: "#000205",}} />
                        </button>
                    : ''
                }
                <Settings setIsProfileOpen={setIsProfileOpen} list={settingsList} size="18px"/>
            </div>
        </div>
    );
}

const ThreeSquare = () => {

    return (
        <div className="three-square">
            <div className="square"></div>
            <div className="square"></div>
            <div className="square"></div>
        </div>
    );
}

const ChatAreaInput = () => {
    const [isClicked, setIsClicked] = useState(false);

    const handleOnClick = () => {
        setIsClicked(true);
    }

    return (
        <div className='chat-area-input'>
            <input type="text" className='chat-area-input-text' onClick={handleOnClick}/>
            {!isClicked &&<ThreeSquare />}
            <button className="chat-area-send-btn">
                <SendOutlined style={{color: '#000', fontSize: '18px'}} />
            </button>
        </div>
    );
}

type msgCardProps = {
    msg: msgCard,
}

const MsgCardMe = ({msg} : msgCardProps) => 
{
    return (
        <div className="chat-area-msg-me-container">
            <div className="chat-area-msg-me">
                <p className="chat-area-message msg-of-me">{msg.content}</p>
                <p className="chat-time time-of-me">{msg.timeSend}</p>
            </div>
        </div>
    );
}

const MsgCardOther = ({msg} : msgCardProps) => 
{
    return (
        <div className="chat-area-msg-other">
            <div className="msg-of-other-username-msg">
                <p className="msg-of-other-username">'msg.sender'</p>
                <p className="chat-area-message">{msg.content}</p>
            </div>
            <div className="msg-of-other-time-img">
                <img src={msg.image} alt="description..."/>
                <p className="chat-time">{msg.timeSend}</p>
            </div>
        </div>
    );
}

type chatAreaMessagesProps =
{
    ListOfMsg: msgListType | null,
}

const ChatAreaMessages = ({ListOfMsg} : chatAreaMessagesProps) => {
    const [myId, setMyId] = useState<number | null>(null);

    useEffect(()=>{
        Axios.get('http://localhost:3000/user/me', {withCredentials: true})
            .then((response) => {
                setMyId(response.data.id);
            })
            .catch()
    }, []);


    const msgCard = ListOfMsg? ListOfMsg.map( msg =>
                    {
                        return    myId === msg.userId ?
                                (<MsgCardMe key={msg.userId} msg={msg} />)
                            :
                                (<MsgCardOther key={msg.userId} msg={msg} />)
                    }
                ) : ''

    return (
        <div className='chat-area-messages'>
            {msgCard}
        </div>
    );
}

type ChatAreaProfile =
{
    setIsProfileOpen: (isOpen: boolean) => void
}

export const ChatAreaProfile = ({setIsProfileOpen}: ChatAreaProfile) => {

    return (
        <div className='chat-area-profile'>
            <div className="chat-area-profile-about">
                <div className="CA-profile-about-xMark">
                    <p>About</p>
                    <button onClick={() => setIsProfileOpen(false)}>
                        <FontAwesomeIcon 
                            className="x-mark" size="xl" icon={faXmark} 
                            style={{color: "#000000",}} />
                    </button>
                </div>
                <img src={Image} alt="img description"/> {/* Click to go to profile */}
                <p className="CA-profile-about-username">Username</p>
                <p className="CA-profile-about-status">Last seen: Active</p>
            </div>
            
            <div className="chat-area-profile-content">
                <div className="chat-area-profile-status">
                    <p className="CA-profile-status-header">Status</p>
                    <div className="CA-profile-status-wins-losses">
                        <p>Wins - 10</p>
                        <p>Losses - 8</p>
                    </div>
                </div>

                <div className="chat-area-profile-achievements">
                    <p className="CA-profile-achievements-header">Achievements</p>
                    <div className="achievements">

                    </div>
                </div>

                <div className="chat-area-profile-ranking">
                    <p className="CA-profile-ranking-header">Ranking - Top 3</p>
                    <div className="Ranking">
                        <div className="Ranking-1">
                            <div className="Ranking-1-number"><p>1</p></div>
                            <div className="Ranking-1-img-username">
                                <img src={Image} alt="description"/>
                                <p>Username</p>
                            </div>
                            <div className="Ranking-1-stat">
                                <p>150</p>
                                <p>Games won</p>
                            </div>
                        </div>

                        <div className="Ranking-2">
                            <div className="Ranking-2-number"><p>2</p></div>
                            <div className="Ranking-2-img-username">
                                <img src={Image} alt="description"/>
                                <p>Username</p>
                            </div>
                            <div className="Ranking-3-stat">
                                <p>100</p>
                                <p>Games won</p>
                            </div>
                        </div>

                        <div className="Ranking-3">
                            <div className="Ranking-3-number"><p>3</p></div>
                            <div className="Ranking-3-img-username">
                                <img src={Image} alt="description"/>
                                <p>Username</p>
                            </div>
                            <div className="Ranking-3-stat">
                                <p>90</p>
                                <p>Games won</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const UserCard = (props: {img: string, username: string}) => {

    return (
        <div className="user-card-img-username">
            <img src={props.img} alt={ 'image'}/>
            <p>{props.username}</p>
        </div>
    );
}

const UserCardPopOverContent = () => {
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [isMuteDialogOpen, setIsMuteDialogOpen] = useState(false);

    const closeDialog = () => {
        setIsRemoveDialogOpen(false);
        setIsMuteDialogOpen(false);
    }

    return (
        <div className="user-card-popover-content">
            <UserCard img={Image} username="BARAE" />
            <div>
                <p className="user-card-win">Win - 5</p>
                <p className="user-card-loses">Loses - 1</p>
            </div>
            <div className="user-card-btn">
                <button>Profile</button>
                <button>Message</button>
            </div>
            <div className="user-card-btn">
                <button onClick={() => setIsRemoveDialogOpen(true)}>Remove</button>
                <button onClick={() => setIsMuteDialogOpen(true)}>Mute</button>
            </div> 
            {
                isRemoveDialogOpen && <Dialog title="Remove Member" closeDialog={closeDialog} />
                ||
                isMuteDialogOpen && <Dialog title="Mute Member" closeDialog={closeDialog} />
            }
        </div>
    );
}

type ChatAreaGroupProps =
{
    setIsChatSettingOpen:   (isOpen: boolean) => void,
}

export const ChatAreaGroup = (props : ChatAreaGroupProps) => {
    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);


    const Trigger = <FriendCard id={0} image={Image} username="BARAE" />;

    const Content = (<UserCardPopOverContent />);

    return (
        <div className="chat-area-group">
            <div className="chat-area-group-search">
                <Search />
            </div>

            <div className="chat-area-group-owner">
                <p className="header">Owner</p>
                <FriendCard id={0} image={Image} username="BARAE"/>
            </div>

            <div className="chat-area-group-members">
                <p className="header">Members</p>
                <div className="chat-area-group-members-list">
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                    <PopoverComp Trigger={Trigger} Content={Content} />
                </div>

            </div>

            <div className="chat-area-group-settings-invite">
                {/* Seetings-Invite btn appears for the owner */}
                <button className="chat-area-group-settings-btn" onClick={() => props.setIsChatSettingOpen(true)}>
                    <p>SETTINGS</p>
                    <FontAwesomeIcon icon={faGear} />
                </button>
                <button className="chat-area-group-invite-btn" onClick={() => setIsInviteDialogOpen(true)}>
                    <p>INVITE</p>
                    {/* <FontAwesomeIcon icon={faUsersMedical} style={{color: "#000000",}} /> */}
                </button>

                {/* leave button appears for the users*/}
                <button className="chat-area-group-leave-btn" onClick={() => setIsLeaveDialogOpen(true)}>
                    <p>Leave</p>
                    {/* <FontAwesomeIcon icon={faUsersMedical} style={{color: "#000000",}} /> */}
                </button>
            </div>
            {isLeaveDialogOpen && <Dialog title="Leave Group" closeDialog={()=> setIsLeaveDialogOpen(false)} />}
            {isInviteDialogOpen && <Dialog title="Invite" closeDialog={() => setIsInviteDialogOpen(false)} />}
        </div>
    );
}

export const ChatGroupSettings = (props : {setIsChatSettingOpen: (isOpen: boolean) => void}) =>
{
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
    const [isClearChatDialogOpen, setIsClearChatDialogOpen] = useState(false);
    const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);

    return (
        <div className="chat-group-settings">
            <div className="chat-group-settings-header">
                <p className="chat-group-settings-grouName">Settings {'GROUP-NAME'}</p>
                <div>
                    <button onClick={() => props.setIsChatSettingOpen(false)}>
                        <FontAwesomeIcon 
                            className="x-mark" size="xl" icon={faXmark} 
                            style={{color: "#000000",}} />
                    </button>
                </div>
            </div>

            <div className="chat-group-settings-content">
                <div className="chat-group-settings-group">
                    <CreateGroupFirstDialog />
                    <div className="chat-group-settings-edit">
                        <button>Edit</button>
                    </div>
                </div>
                <div className="chat-group-settings-users">
                    <div>
                        <p>Users</p>
                        <div className="chat-group-settings-users-list">
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                        </div>
                    </div>
                    <div>
                        <p>Owner</p>
                        <div className="chat-group-settings-owner">
                            <UserCard img={Image} username="BARAE" />
                            <div className="chat-group-settings-owner-btn">
                                <button onClick={() => setIsAddAdminDialogOpen(true)}>Add Admin</button>
                                <button onClick={() => setIsInviteDialogOpen(true)}>Invite</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>Admins</p>
                        <div className="chat-group-settings-admins">
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            {/* <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" />
                            <UserCard img={Image} username="BARAE" /> */}
                        </div>
                    </div>
                    <div className="chat-group-settings-clear-delete">
                        <button onClick={() => setIsClearChatDialogOpen(true)}>Clear chat</button>
                        <button className="delete" onClick={() => setIsDeleteGroupDialogOpen(true)}>Delete group</button>
                    </div>
                </div>
            </div>
            {isInviteDialogOpen && <Dialog title="Invite" closeDialog={() => setIsInviteDialogOpen(false)} />}
            {isAddAdminDialogOpen && <Dialog title="Add Admin" closeDialog={() => setIsAddAdminDialogOpen(false)} />}
            {isClearChatDialogOpen && <Dialog title="Clear Chat" closeDialog={() => setIsClearChatDialogOpen(false)} />}
            {isDeleteGroupDialogOpen && <Dialog title="Delete Group" closeDialog={() => setIsDeleteGroupDialogOpen(false)} />}
        </div>
    );
}

type ChatAreaProps = {
    // ListOfMsg:          msgListType,
    chatId:             string | null;
    type:               string | null,
    chatName:           string | null,
    chatImage:          string | null,
    setIsProfileOpen:   (isOpen: boolean) => void,
}

export const ChatArea = ({chatId, setIsProfileOpen, type, chatName, chatImage} : ChatAreaProps) => {
    const [msgList, setmsgList] = useState<msgListType | null>(null);

    useEffect(() => {
        if (!chatId)
          return;
        Axios.post("http://localhost:3000/chat/all-msg/", {channelId: chatId}, {withCredentials: true})
            .then((response) => {
                // console.log(response.data);
                setmsgList(response.data);
              }
            )
            .catch((error) => {
                console.log(error);
              }
            );
      },[chatId]);

    return (
        <>
            <div className='chat-area-container'>
                <ChatAreaHeader setIsProfileOpen={setIsProfileOpen} type={type} 
                    chatName={chatName} chatImage={chatImage} />
                <ChatAreaMessages ListOfMsg={msgList}/>
                <ChatAreaInput />
            </div>
        </>
    );
}
