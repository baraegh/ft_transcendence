import React, {useState, useEffect, useContext} from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faKhanda, faXmark, faGear} from '@fortawesome/free-solid-svg-icons';
import {SendOutlined} from '@ant-design/icons';
import { Settings, Search } from "../tools/filterSearchSettings";
import { CreateGroupFirstDialog, Type, createGroupType } from "../tools/Dialog";
import PopoverComp from "../tools/popover";
import { Dialog } from "../tools/Dialog";
import { chatInfoType, membersDataType } from "../chat";
import { userMe } from "../../App";
import "./chatArea.css"

import defaultUserImage from '../../assets/person.png';
import dfaultGroupImage from '../../assets/group.png';

import Image from '../barae.jpg';

type msgCard = {userId: number, content: string, timeSend: string, image: string}
export type msgListType = msgCard[];

const settingsList = ['Profile', 'Delete', 'Block'];

type chatAreaHeaderProps =
{
    chatInfo:           chatInfoType,
    setIsProfileOpen:   (isopen: boolean) => void,
    setMsgSend:         (msgSend: boolean) => void,
    msgSend:            boolean,
}

const ChatAreaHeader = ({setIsProfileOpen, chatInfo, setMsgSend, msgSend} : chatAreaHeaderProps) => {

    return (
        <div className='chat-area-header'>
            <div className="user-card">
                <img    src={chatInfo.chatImage? chatInfo.chatImage: 'deafault image'}
                        alt={`${chatInfo.chatName} image`}/>
                <div>
                    <p className="user-card-username">{chatInfo.chatName}</p>
                    <p className="user-card-status">active | to be edited</p>
                </div>
            </div>
            <div className="challenge-setting">
                {
                    (chatInfo.chatType === 'PERSONEL') ?
                        <>
                            <button className="challenge-btn">
                                <p>Challenge</p>
                                <FontAwesomeIcon icon={faKhanda} style={{color: "#000205",}} />
                            </button>
                            <Settings   chatInfo={chatInfo}
                                        setIsProfileOpen={setIsProfileOpen}
                                        list={settingsList}
                                        size="18px"
                                        setMsgSend={setMsgSend}
                                        msgSend={msgSend}/>
                        </>
                    : ''
                }
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

type chatAreaInputProps ={
    chatInfo:   chatInfoType,
    setMsgSend: (msgSend: boolean) => void,
    msgSend:    boolean,
}

const ChatAreaInput = ({chatInfo, setMsgSend, msgSend}: chatAreaInputProps) => {
    const [isClicked, setIsClicked] = useState(false);
    const [msg, setMsg] = useState<string>('');

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsClicked(true);
        setMsg(e.target.value);
    }

    const checkNameInput = (input : string): boolean =>
    {
        if (input === '')
            return true;

        const trimmedString = input.trim();
        if (!(trimmedString.length > 0))
            return true;    
        return false;
    }

    const handleOnSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (checkNameInput(msg))
            return;
        Axios.post("http://localhost:3000/chat/send-msg",
                {   
                    channelID:  chatInfo.chatId,
                    content:    msg,
                },
                {withCredentials: true})
            .then(() => {
                setMsgSend(!msgSend);
                setMsg('');
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <form className='chat-area-input' onSubmit={handleOnSubmit}>
            <input  type="text"
                    id="chat-area-input-text"
                    value={msg} 
                    className='chat-area-input-text'
                    onChange={handleOnChange}/>
            {!isClicked &&<ThreeSquare />}
            <button className="chat-area-send-btn" type="submit">
                <SendOutlined style={{color: '#000', fontSize: '18px'}} />
            </button>
        </form>
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
    const me = useContext(userMe);
    let i = 0;

    const msgCard = ListOfMsg? ListOfMsg.map( msg =>
                    {
                        return    me?.id === msg.userId ?
                                (<MsgCardMe key={msg.userId + i++} msg={msg} />)
                            :
                                (<MsgCardOther key={msg.userId + i++} msg={msg} />)
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
    setIsProfileOpen:   (isOpen: boolean) => void,
    chatInfo:             chatInfoType,
}

type RankItem = {
    rank:       number;
    id:         number;
    image:      string;
    username:   string;
    gameWon:    number;
}

type profileDataType = {
    username:       string,
    gameWon:        number,
    gameLost:       number,
    achievements:   string[] | null,
    updatedAt:      string,
    rank:          RankItem[],
}

export const ChatAreaProfile = ({setIsProfileOpen, chatInfo}: ChatAreaProfile) => {

    const   [profileData, setProfileData] = useState<profileDataType>({
        username:       '',
        gameWon:        0,
        gameLost:       0,
        achievements:   null,
        updatedAt:      '',
        rank:           [],
    });

    useEffect(() => {
        if (!chatInfo.chatUserId)
            return;
        Axios.get(`http://localhost:3000/chat/aboutfriend/${chatInfo.chatUserId}`,
            { withCredentials: true })
            .then((response) => {
                setProfileData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

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
                <img src={chatInfo.chatImage} alt={`${chatInfo.chatName} image`}/> {/* Click to go to profile */}
                <p className="CA-profile-about-username">{chatInfo.chatName}</p>
                <p className="CA-profile-about-status">Last seen: Active | to be fixed</p>
            </div>
            
            <div className="chat-area-profile-content">
                <div className="chat-area-profile-status">
                    <p className="CA-profile-status-header">Status</p>
                    <div className="CA-profile-status-wins-losses">
                        <p>Wins - {profileData.gameWon? profileData.gameWon: 0}</p>
                        <p>Losses - {profileData.gameLost? profileData.gameLost: 0}</p>
                    </div>
                </div>

                <div className="chat-area-profile-achievements">
                    <p className="CA-profile-achievements-header">Achievements</p>
                    <div className="achievements">
                        {profileData.achievements && profileData.achievements.length !== 0 ? 
                            profileData.achievements: <p>No achievements</p>}
                    </div>
                </div>

                <div className="chat-area-profile-ranking">
                    <p className="CA-profile-ranking-header">Ranking - Top 3 | to be fixed</p>
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

const MemberCard = (props: {img: string | undefined, username: string | undefined}) => {

    return (
        <div className="user-card-img-username">
            <img    src={props.img? props.img : defaultUserImage}
                    alt={`${props.username}'s image`}/>
            <p>{props.username}</p>
        </div>
    );
}

type MemberCardPopOverContentProps = {
    role:       string,
    img:        string,
    username:   string,
    id:         number,
    setChat?:   (Id: string, Image: string, Name: string,
                Type: string, userId: number | null) => void,  
    chatInfo:   chatInfoType;
    setUpdate:  (update: boolean) => void,
    update:     boolean,
}

const MemberCardPopOverContent = ({role, img, username, id, setChat,
                                    chatInfo, setUpdate, update} : MemberCardPopOverContentProps) => {
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [isMuteDialogOpen, setIsMuteDialogOpen] = useState(false);
    const [profileData, setProfileData] = useState<profileDataType>({
        username:       '',
        gameWon:        0,
        gameLost:       0,
        achievements:   null,
        updatedAt:      '',
        rank:           [],
    });
    const me = useContext(userMe);

    useEffect(() => {
        if (setChat)
            setChat(chatInfo.chatId, chatInfo.chatImage,
                    chatInfo.chatName, chatInfo.chatType, id);
    }, []);

    const closeDialog = () => {
        setIsRemoveDialogOpen(false);
        setIsMuteDialogOpen(false);
    }

    const handleMessage = () => {
        Axios.post(`http://localhost:3000/chat/join-friend`,
                { receiverId: id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                })
            .then((response) => {
                if (setChat )
                    setChat(response.data, img, username,
                            'PERSONEL', id);
                if (closeDialog)
                    closeDialog();
            })
            .catch((error) => {
                console.log(error);
            }
            );
    }

    return (
        <div className="user-card-popover-content">
            <MemberCard img={img} username={username} />
            <div>
                <p className="user-card-win">Win - {profileData.gameWon? profileData.gameWon: 0}</p>
                <p className="user-card-loses">Loses - {profileData.gameLost? profileData.gameLost: 0}</p>
            </div>
            <div className="user-card-btn">
                <button>Profile</button>
                {
                    id !==  me?.id? 
                        <button onClick={handleMessage}>Message</button>
                    : ''
                }
            </div>
            <div className="user-card-btn">
                {
                    role === 'owner' || role === 'admin' ?
                        <>
                            <button onClick={() => setIsRemoveDialogOpen(true)}>Remove</button>
                            <button onClick={() => setIsMuteDialogOpen(true)}>Mute</button>
                        </>
                    : ''
                }
            </div> 
            {
                isRemoveDialogOpen && <Dialog   title="Remove Member"
                                                closeDialog={closeDialog}
                                                chatInfo={chatInfo}
                                                setUpdate={setUpdate}
                                                update={update} />
                ||
                isMuteDialogOpen && <Dialog title="Mute Member" 
                                            closeDialog={closeDialog}
                                            chatInfo={chatInfo} />
            }
        </div>
    );
}

type ChatGroupSettingsProps = {
    setIsChatSettingOpen:   (isOpen: boolean) => void,
    membersData:            membersDataType | null,
    chatInfo:               chatInfoType,
    setChatInfo:            (chatInfo: chatInfoType) => void,
    role:                   string,
}

export const ChatGroupSettings = (props : ChatGroupSettingsProps) =>
{
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
    const [isClearChatDialogOpen, setIsClearChatDialogOpen] = useState(false);
    const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
    const [groupData, setGroupData] = useState<createGroupType>({
        type: Type.PUBLIC,
        name: '',
        image: null,
        hash:'',
        members: [''],
    }); //to be edited

    const handleOnChange = () => {
        // to be edited
    }

    return (
        <div className="chat-group-settings">
            <div className="chat-group-settings-header">
                <p className="chat-group-settings-grouName">Settings {'GROUP-NAME'}</p>
                <div>
                    <button onClick={() => props.setIsChatSettingOpen(false)}>
                        <FontAwesomeIcon 
                            className="x-mark"
                            size="xl"
                            icon={faXmark} 
                            style={{color: "#000000",}} />
                    </button>
                </div>
            </div>

            <div className="chat-group-settings-content">
                <div className="chat-group-settings-group">
                    <CreateGroupFirstDialog GroupData={groupData}
                                            handleOnChange={handleOnChange}/>
                    <div className="chat-group-settings-edit">
                        <button>Edit</button>
                    </div>
                </div>
                <div className="chat-group-settings-users">
                    <div>
                        <p>Users</p>
                        <div className="chat-group-settings-users-list">
                            {/* <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" /> */}
                        </div>
                    </div>
                    <div>
                        <p>Owner</p>
                        <div className="chat-group-settings-owner">
                            {/* <MemberCard img={Image} username="BARAE" /> */}
                            <div className="chat-group-settings-owner-btn">
                                {<button onClick={() => setIsAddAdminDialogOpen(true)}>Add Admin</button>}
                                {<button onClick={() => setIsInviteDialogOpen(true)}>Invite</button>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>Admins</p>
                        <div className="chat-group-settings-admins">
                            {/* <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" /> */}
                            {/* <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" />
                            <MemberCard img={Image} username="BARAE" /> */}
                        </div>
                    </div>
                    <div className="chat-group-settings-clear-delete">
                        {<button onClick={() => setIsClearChatDialogOpen(true)}>Clear chat</button>}
                        {<button className="delete" onClick={() => setIsDeleteGroupDialogOpen(true)}>Delete group</button>}
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

type ChatAreaGroupProps =
{
    setIsChatSettingOpen:   (isOpen: boolean) => void,
    chatInfo:               chatInfoType,
    membersData:            membersDataType,
    setMembersData:         (membersData: membersDataType) => void,
    role:                   string,
    setChat:                (Id: string, Image: string, Name: string,
                            Type: string, userId: number | null) => void,
    update:                 boolean,
    setUpdate:              (update: boolean) => void,
}

export const ChatAreaGroup = (props : ChatAreaGroupProps) => {
    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        Axios.get(`http://localhost:3000/chat/show-members/${props.chatInfo.chatId}`,
                {withCredentials: true})
            .then((response) => {
                props.setMembersData(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
        }, [props.update]);

    const admins = props.membersData?.admins.length !== 0 ? props.membersData?.admins.map((admin) => {
        return  <PopoverComp    Trigger={<MemberCard    img={admin.image}
                                                        username={admin.username} />}
                                Content={<MemberCardPopOverContent  role={props.role} 
                                                                    img={admin.image}
                                                                    username={admin.username}
                                                                    id={admin.id}
                                                                    setChat={props.setChat}
                                                                    chatInfo={props.chatInfo}
                                                                    setUpdate={props.setUpdate}
                                                                    update={props.update} />}
                                key={admin.id}/>
    }) : null;

    const users = props.membersData?.users.length !== 0 ? props.membersData?.users.map((user) => {
        return  <PopoverComp    Trigger={<MemberCard    img={user.image}
                                                        username={user.username}/>}
                                Content={<MemberCardPopOverContent role={props.role}
                                                                    img={user.image}
                                                                    username={user.username}
                                                                    id={user.id} 
                                                                    setChat={props.setChat}
                                                                    chatInfo={props.chatInfo}
                                                                    setUpdate={props.setUpdate}
                                                                    update={props.update} />}
                                key={user.id}/>
    }) : null;

    const filteredAdmins = admins
  ? admins.filter((admin) =>
      admin.props.Trigger.props.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : null;

    const filteredUsers = users
    ? users.filter((user) =>
        user.props.Trigger.props.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : null;

    const {owner} = props.membersData;

    return (
        <div className="chat-area-group">
            <div className="group-owner-admins-members">
                <div className="chat-area-group-search">
                    <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
                {   searchQuery === '' ?
                        <div className="chat-area-group-owner">
                            <p className="header">Owner</p>
                            <PopoverComp    Trigger={<MemberCard   img={props.membersData?.owner.image}
                                                                username={props.membersData?.owner.username} />}
                                            Content={<MemberCardPopOverContent  role=''
                                                                                img={owner.image}
                                                                                username={owner.username}
                                                                                id={owner.id}
                                                                                setChat={props.setChat}
                                                                                chatInfo={props.chatInfo}
                                                                                setUpdate={props.setUpdate}
                                                                                update={props.update} />}/>
                        </div>
                    : ''
                }
                <div className="chat-area-group-admins-members">
                    <p className="header">Admins</p>
                    <div className="chat-area-group-admins">
                        <div className="chat-area-group-admins-list">
                            {filteredAdmins && filteredAdmins.length !== 0 ? filteredAdmins: <p className="No-data">No admin</p>}
                        </div>
                    </div>

                    <div className="chat-area-group-members">
                        <p className="header">Members</p>
                        <div className="chat-area-group-members-list">
                            {filteredUsers && filteredUsers.length !== 0 ? filteredUsers: <p className="No-data">No member</p>}
                        </div>
                </div>

                </div>
            </div>

            <div className="chat-area-group-settings-invite">
                {
                    props.role == 'owner' ?
                        <button className="chat-area-group-settings-btn" onClick={() => props.setIsChatSettingOpen(true)}>
                            <p>SETTINGS</p>
                            <FontAwesomeIcon icon={faGear} />
                        </button>
                    : ''
                }

                {
                    props.role == 'owner' ?
                        <button className="chat-area-group-invite-btn" onClick={() => setIsInviteDialogOpen(true)}>
                            <p>INVITE</p>
                            {/* <FontAwesomeIcon icon={faUsersMedical} style={{color: "#000000",}} /> */}
                        </button>
                        : ''
                }

                <button className="chat-area-group-leave-btn" onClick={() => setIsLeaveDialogOpen(true)}>
                    <p>Leave</p>
                    {/* <FontAwesomeIcon icon={faUsersMedical} style={{color: "#000000",}} /> */}
                </button>
            </div>
            {isLeaveDialogOpen && <Dialog   chatInfo={props.chatInfo}
                                            title="Leave Group"
                                            closeDialog={()=> setIsLeaveDialogOpen(false)}
                                            update={props.update}
                                            setUpdate={props.setUpdate} />}

            {isInviteDialogOpen && <Dialog  chatInfo={props.chatInfo}
                                            title="Invite"
                                            closeDialog={() => setIsInviteDialogOpen(false)}
                                            update={props.update}
                                            setUpdate={props.setUpdate} />}
        </div>
    );
}

type ChatAreaProps = {
    chatInfo:           chatInfoType,
    setIsProfileOpen:   (isOpen: boolean) => void,
}

export const ChatArea = ({chatInfo, setIsProfileOpen} : ChatAreaProps) => {
    const [msgList, setmsgList] = useState<msgListType | null>(null);
    const [msgSend, setMsgSend] = useState(false);


    useEffect(() => {
        if (!chatInfo.chatId)
          return;
        Axios.post("http://localhost:3000/chat/all-msg/", {channelId: chatInfo.chatId}, 
                {withCredentials: true})
            .then((response) => {
                setmsgList(response.data);
              }
            )
            .catch((error) => {
                console.log(error);
              }
            );
      }, [chatInfo.chatId, msgSend]);

    return (
        <>
            <div className='chat-area-container'>
                <ChatAreaHeader setIsProfileOpen={setIsProfileOpen} 
                                chatInfo={chatInfo}
                                setMsgSend={setMsgSend}
                                msgSend={msgSend}/>
                <ChatAreaMessages ListOfMsg={msgList}/>
                <ChatAreaInput  setMsgSend={setMsgSend}
                                msgSend={msgSend}
                                chatInfo={chatInfo} />
            </div>
        </>
    );
}
