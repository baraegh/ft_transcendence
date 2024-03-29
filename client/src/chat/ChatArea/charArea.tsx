import React, {useState, useEffect, useContext, useRef} from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faKhanda, faXmark, faGear} from '@fortawesome/free-solid-svg-icons';
import {SendOutlined} from '@ant-design/icons';
import { Settings, Search } from "../tools/filterSearchSettings";
import { CreateGroupFirstDialog, Type, createGroupType } from "../tools/Dialog";
import PopoverComp from "../tools/popover";
import { Dialog } from "../tools/Dialog";
import { chatInfoType, formatDate, membersDataType } from "../chat";
import { userMe } from "../../App";
import "./chatArea.css"
import defaultUserImage from '../../assets/person.png';
import { format } from "../chatHistory/chatHistoryList";
import { SocketContext } from "../../socket/socketContext";
import defaultGroupImage from '../../assets/group.png';
import Bronze from '../../front-end/img/bronze.png';
import Silver from '../../front-end/img/silver.png';
import Gold from '../../front-end/img/gold.png';
import Maps from "../../front-end/tsx/maps";
import { useNavigate, useParams } from "react-router-dom";

type msgCard = {userId: number, content: string, timeSend: string, image: string}
export type msgListType = msgCard[];

type chatAreaHeaderProps =
{
    chatInfo:           chatInfoType,
    setIsProfileOpen:   (isopen: boolean) => void,
    setMsgSend:         (msgSend: boolean) => void,
    msgSend:            boolean,
    setUpdateChatInfo:  (update: boolean) => void,
    setChat:            (Id: string, Image: string, Name: string,
                            Type: string, userId: number | null,
                            blocked?: boolean, whoblock?: number | null) => void,
    leaveRoom:          () => void,
    updateChatInfo:     boolean,
}

const ChatAreaHeader = ({setIsProfileOpen, chatInfo, setMsgSend,
                            setUpdateChatInfo, msgSend, setChat,
                            leaveRoom, updateChatInfo} : chatAreaHeaderProps) => {
    const [isOnline, setIsOnline] = useState(false);
    const me = useContext(userMe);
    let {userId} = useParams();

    const navigate = useNavigate();
    const settingsList = chatInfo.blocked?(
            me?.id === chatInfo.whoblock?
                ['Profile', 'Delete', 'Unblock']
            : ['Delete']
        )
        :['Profile', 'Delete', 'Block'];

    useEffect(() => {
        if (!chatInfo.chatUserId)
            return;
        let intervalId : number | undefined;
      
        const fetchData = () => {

          Axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/isonline/${chatInfo.chatUserId}`,
                { withCredentials: true })
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
    }, [chatInfo.chatId]);

    
    return (
        <div className='chat-area-header'>
            <div className="user-card" onClick={() => {navigate(`/user/${chatInfo.chatUserId}`)}}>
                <img    src={chatInfo.chatImage? chatInfo.chatImage: defaultGroupImage}
                        alt={`${chatInfo.chatName} image`}/>
                <div>
                    <p className="user-card-username">{format(chatInfo.chatName, 12)}</p>
                    {
                        chatInfo.chatType !== 'PERSONEL'?
                            ''
                        :   <p className="user-card-status">{isOnline? 'online': 'offline'}</p> 
                    }
                </div>
            </div>
            <div className="challenge-setting">
                {
                    (chatInfo.chatType === 'PERSONEL') ?
                        <>
                            {
                                !chatInfo.blocked?
                                    <div className="challenge-btn">
                                        <Maps buttonText='Challenge' id={chatInfo.chatUserId} />
                                        {/* <p>Challenge</p> */}
                                        <FontAwesomeIcon icon={faKhanda} style={{color: "#000205",}} />
                                    </div>
                                : ''
                            }
                            <Settings   chatInfo={chatInfo}
                                        setIsProfileOpen={setIsProfileOpen}
                                        list={settingsList}
                                        size="18px"
                                        setMsgSend={setMsgSend}
                                        msgSend={msgSend}
                                        setUpdateChatInfo={setUpdateChatInfo}
                                        updateChatInfo={updateChatInfo}
                                        setChat={setChat}
                                        leaveRoom={leaveRoom}/>
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
    chatInfo:           chatInfoType,
    sendingroup:        (msg: string) => void,
    setUpdateChatInfo:  (update: boolean) => void,
    updateChatInfo:     boolean,
    setChat:            (Id: string, Image: string, Name: string,
                            Type: string, userId: number | null,
                            blocked?: boolean, whoblock?: number | null, muted?: string) => void
}

const ChatAreaInput = ({chatInfo, sendingroup, setChat,
                        setUpdateChatInfo, updateChatInfo}: chatAreaInputProps) => {
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

        // Axios.get(`${import.meta.env.VITE_BACKEND_URL}/other-profile/about/${chatInfo.chatUserId}`,
        //         {withCredentials:    true,})
        //     .then((response) => {
        //         console.log(response.data);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });

        if (checkNameInput(msg) || chatInfo.blocked || chatInfo.mute !== 'NAN')
            return;
        Axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat/is_muted`,
                {channelId: chatInfo.chatId,},
                {withCredentials:    true,})
            .then((response) => {
                if (response.data)
                    return;
                Axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat/send-msg`,
                        {   
                            channelID:  chatInfo.chatId,
                            content:    msg,
                        },
                        {withCredentials: true})
                    .then(() => {
                        sendingroup(msg);
                        setUpdateChatInfo(!updateChatInfo);
                        setMsg('');
                    })
                    .catch((error) => {
                        console.log(error);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <form className='chat-area-input' onSubmit={handleOnSubmit}>
            <input  type="text"
                    id="chat-area-input-text"
                    value={msg} 
                    className='chat-area-input-text'
                    onChange={handleOnChange}
                    readOnly={chatInfo.blocked || chatInfo.mute !== 'NAN'}/>
            {!isClicked && !chatInfo.blocked && chatInfo.mute === 'NAN' && <ThreeSquare />}
            {
                !chatInfo.blocked && chatInfo.mute === 'NAN' &&
                    <button className="chat-area-send-btn" type="submit">
                        <SendOutlined style={{color: '#000', fontSize: '18px'}} />
                    </button>
            }
        </form>
    );
}

type msgCardProps = {
    msg:        msgCard,
    chatInfo?:  chatInfoType,
}

const MsgCardMe = ({msg} : msgCardProps) => 
{
    return (
        <div className="chat-area-msg-me-container">
            <div className="chat-area-msg-me">
                <p className="chat-area-message msg-of-me">{msg.content}</p>
                <p className="chat-time time-of-me">{formatDate(msg.timeSend)}</p>
            </div>
        </div>
    );
}

const MsgCardOther = ({chatInfo, msg} : msgCardProps) => 
{
    const [name, setName] = useState('');

    useEffect(() => {
        if (msg === undefined || !msg.userId)
            return;

        Axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat/aboutfriend/${msg.userId}`,
            { withCredentials: true })
            .then((response) => {
                setName(response.data.username);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="chat-area-msg-other">
            <div className="msg-of-other-username-msg">
                <p className="msg-of-other-username">{name}</p>
                <p className="chat-area-message">{msg.content}</p>
            </div>
            <div className="msg-of-other-time-img">
                <img src={msg.image} alt="description..."/>
                <p className="chat-time">{formatDate(msg.timeSend)}</p>
            </div>
        </div>
    );
}

type chatAreaMessagesProps =
{
    ListOfMsg:  msgListType,
    chatInfo:   chatInfoType,
}

const ChatAreaMessages = ({chatInfo, ListOfMsg} : chatAreaMessagesProps) => {
    const me = useContext(userMe);
    let i = 0;
    const chatAreaRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        if (chatAreaRef && chatAreaRef.current)
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }, [ListOfMsg]);

    const msgCard = ListOfMsg.length !== 0? ListOfMsg.map( msg =>
                    {
                        return    me?.id === msg.userId ?
                                (<MsgCardMe key={msg.userId + i++}
                                            msg={msg} />)
                            :
                                (<MsgCardOther  key={msg.userId + i++}
                                                msg={msg}
                                                chatInfo={chatInfo}/>)
                    }
                ) : '';

    return (
        <div className='chat-area-messages' ref={chatAreaRef}>
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
    gameWon:    number | null;
}

type profileDataType = {
    username:       string,
    gameWon:        number,
    gameLost:       number,
    achievements:   string[] | null,
    updatedAt:      string,
    rank:          RankItem[],
}

type RankCardProps ={
    ranked:    RankItem,
}

const RankCard = ({ranked} : RankCardProps) => {
    const navigate = useNavigate();

    if (ranked.rank === 1)
    {
        return (
            <div className="Ranking-1">
                <div className="Ranking-1-number"><p>{ranked.rank}</p></div>
                <div className="Ranking-1-img-username" onClick={() => {navigate(`/user/${ranked.id}`)}}>
                    <img src={ranked.image} alt={`${ranked.username}'s image`}/>
                    <p>{ranked.username}</p>
                </div>
                <div className="Ranking-1-stat">
                    <p>{ranked.gameWon? ranked.gameWon: 0}</p>    
                    <p>Games won</p>
                </div>
            </div>
        )

    }

    return (
        <div className="Ranking-2" onClick={() => {navigate(`/user/${ranked.id}`)}}>
            <div className="Ranking-2-number"><p>{ranked.rank}</p></div>
            <div className="Ranking-2-img-username">
                <img src={ranked.image} alt={`${ranked.username}'s image`}/>
                <p>{format(ranked.username, 4)}</p>
            </div>
            <div className="Ranking-2-stat" onClick={() => {navigate(`/user/${ranked.id}`)}}>
                <p>{ranked.gameWon? ranked.gameWon: 0}</p>
                <p>Games won</p>
            </div>
        </div>
    )
}

type ChatAreaProfileProps ={
    setIsProfileOpen:   (open: boolean) => void,
    chatInfo:           chatInfoType,
}

export const ChatAreaProfile = ({setIsProfileOpen, chatInfo}: ChatAreaProfileProps) => {

    const navigate = useNavigate()
    const   [profileData, setProfileData] = useState<profileDataType>({
        username:       '',
        gameWon:        0,
        gameLost:       0,
        achievements:   null,
        updatedAt:      '',
        rank:           [],
    });
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        if (!chatInfo.chatUserId)
            return;
        Axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat/aboutfriend/${chatInfo.chatUserId}`,
            { withCredentials: true })
            .then((response) => {
                setProfileData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [chatInfo.chatId]);

    const rankCard = profileData.rank.length !== 0?
                        profileData.rank.map((data) => {
                            return <RankCard ranked={data} key={data.username}/>
                        })
                    : null;
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
                <div onClick={() => {navigate(`/user/${chatInfo.chatUserId}`)}}>
                    <img src={chatInfo.chatImage} alt={`${chatInfo.chatName} image`}/> {/* Click to go to profile */}
                    <p className="CA-profile-about-username">{chatInfo.chatName}</p>
                </div>
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
                        {
                            profileData.achievements && profileData.achievements.length !== 0 ? 
                               profileData.achievements.map((a: string) =>{
                                    if (a === "1")
                                        return <img className="achievement-badge"
                                                    key={1}
                                                    src={Bronze}
                                                    alt="bronze"/>;
                                    if (a === "2")
                                        return <img className="achievement-badge"
                                                    key={2}
                                                    src={Silver}
                                                    alt="silver"/>;
                                    if (a === "3")
                                        return <img className="achievement-badge"
                                                    key={3}
                                                    src={Gold}
                                                    alt="Gold"/>;
                                    return (<p className="No-data"
                                                style={{textAlign: 'center'}}
                                                key={"No-Achievement"}>No Achievement</p>);
                               })
                            : <p className="No-data" style={{textAlign: 'center'}}>No Achievements</p>
                        }
                    </div>
                </div>

                <div className="chat-area-profile-ranking">
                    <p className="CA-profile-ranking-header">Ranking</p>
                    <div className="Ranking">
                        {rankCard? rankCard: <p className="No-data" style={{textAlign: 'center'}}>No Rank</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

const MemberCard = (props: {img: string, username: string}) => {

    return (
        <div className="user-card-img-username">
            <img    src={props.img? props.img : defaultUserImage}
                    alt={`${props.username}'s image`}/>
            <p>{format(props.username, 14)}</p>
        </div>
    );
}

type MemberCardPopOverContentProps = {
    role:       string,
    img:        string,
    username:   string,
    id:         number,
    setChat?:   (Id: string, Image: string, Name: string,
                Type: string, userId: number | null, blocked?: boolean,
                whoblock?: number | null, muted?: string) => void,  
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
    const {socket} = useContext<any | undefined>(SocketContext);
    const navigate = useNavigate();

    const joinRoom = (channelId: string) =>{
        if (socket) {
            socket.emit('joinRoom', channelId);
        }
    }

    const closeDialog = () => {
        setIsRemoveDialogOpen(false);
        setIsMuteDialogOpen(false);
    }

    const handleMessage = () => {
        Axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat/join-friend`,
                { receiverId: id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                })
            .then((response) => {
                if (setChat )
                    setChat(response.data.channelID, img, username,
                            'PERSONEL', id, response.data.blocked, response.data.hasblocked);
                if (!response.data.blocked)
                    joinRoom(response.data.channelID);
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
                <button onClick={() => {navigate(`/user/${id}`)}}>Profile</button>
                {
                    id !==  me?.id? 
                        <button onClick={handleMessage}>Message</button>
                    : ''
                }
            </div>
            <div className="user-card-btn">
                {
                    (role === 'owner' || role === 'admin') && id !==  me?.id ?
                        <>
                            <button onClick={() => {
                                                    setIsRemoveDialogOpen(true)
                                                    if (setChat)
                                                        setChat(chatInfo.chatId, chatInfo.chatId, chatInfo.chatName,
                                                            chatInfo.chatType, id);
                                                }}>
                                Remove
                            </button>
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
                                                update={update}
                                                setChat={setChat}/>
                ||
                isMuteDialogOpen && <Dialog title="Mute Member" 
                                            closeDialog={closeDialog}
                                            chatInfo={chatInfo}
                                            role={role}
                                            userId={id}
                                            setChat={setChat}/>
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
    setMembersData:         (membersData: membersDataType) => void,
    setChat:                (Id: string, Image: string, Name: string,
                                Type: string, userId: number | null) => void,
}

export const ChatGroupSettings = (props : ChatGroupSettingsProps) =>
{
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
    const [isClearChatDialogOpen, setIsClearChatDialogOpen] = useState(false);
    const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
    const [update, setUpdate] = useState(false);
    const [membersWarn, setMembersWarn] = useState(false);
    const [updatedAdmins, setUpdatedAdmins] = useState(false);
    const [nameWarn, setNameWarn] = useState(false);
    const [nameExist, setNameExist] = useState(false);
    const [fileWarn, setFileWarn] = useState(false);
    const [groupData, setGroupData] = useState<createGroupType>({
        type: Type.PUBLIC,
        name: '',
        image: null,
        hash:'',
        members: [''],
    }); //to be edited

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>
                            | { name: string; value: string; isChecked: boolean }
                            | { name: string; value: string; isChecked?: boolean }
                            | { id: number; isChecked: boolean}) => {
        if (nameWarn)
            setNameWarn(false);
        if (nameExist)
            setNameExist(false);
        if (fileWarn)
            setFileWarn(false);
        if (membersWarn)
            setMembersWarn(false);
        if ('target' in e)
        {
            const {name, value, type} = e.target;

            if (type === 'file') {
                const file = e.target.files && e.target.files[0];
                setGroupData({ ...groupData, [name]: file });
            }
            else
                setGroupData({ ...groupData, [name]: value });
        }
        else if ( 'name' in e && e.name == 'members')
        {
            const {name, value, isChecked} = e;
            const updatedMembers = isChecked ? 
                    [...groupData.members, value.toString()]
                :   groupData.members.filter(member => member !== value);

            setGroupData({...groupData, [name]: updatedMembers});
        }
        else if ('name' in e)
        {
            const {name, value} = e;
            setGroupData({...groupData, [name]: value});
        }
    }

    const OnEdit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('channelid', props.chatInfo.chatId);
        if (groupData.type === 'PRIVATE' && groupData.hash !== '')
            formData.append('type', 'PROTECTED');
        else
            formData.append('type', groupData.type);
        formData.append('name', groupData.name);
        formData.append('hash', groupData.hash)
        if (groupData.image !== null)
            formData.append('image', groupData.image);

        Axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat/setting/edit-group`,
                formData,
                {withCredentials: true})
            .then((response) => { 
                props.setChat(props.chatInfo.chatId, 
                                response.data.image? response.data.image: props.chatInfo.chatImage,
                                response.data.name, response.data.type, null);
                props.setIsChatSettingOpen(false);
            })
            .catch((error) => {
                console.log(error);
            });

    }

    useEffect(() => {
        if (!updatedAdmins)
            return;
        Axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat/show-members/${props.chatInfo.chatId}`,
            {withCredentials: true})
            .then((response) => {
                props.setMembersData(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [updatedAdmins])

    const members = props.membersData?
                        props.membersData.users.length > 0 ?
                            props.membersData.users.map((member) => {
                                return <MemberCard  img={member.image}
                                                    username={member.username}
                                                    key={member.id}/>
                            })
                        : null
                    : null;

    const admins = props.membersData?
                    props.membersData.admins.length > 0 ?
                            props.membersData.admins.map((admin) => {
                                return <MemberCard  img={admin.image}
                                                    username={admin.username}
                                                    key={admin.id}/>
                            })
                        : null
                    : null;

    return (
        <div className="chat-group-settings">
            <div className="chat-group-settings-header">
                <p className="chat-group-settings-grouName">{props.chatInfo.chatName.toUpperCase()}'s Settings</p>
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
                        <button type="submit" onClick={OnEdit}>Edit</button>
                    </div>
                </div>
                <div className="chat-group-settings-users">
                    <div>
                        <p>Members</p>
                        <div className="chat-group-settings-users-list">
                            {members? members : <p className="No-data">No Member</p>}
                        </div>
                    </div>
                    <div>
                        <p>Owner</p>
                        <div className="chat-group-settings-owner">
                            <MemberCard img={props.membersData? props.membersData.owner.image: defaultUserImage}
                                        username={props.membersData? props.membersData.owner.username : 'name'} />
                            <div className="chat-group-settings-owner-btn">
                                {<button onClick={() => setIsAddAdminDialogOpen(true)}>Add Admin</button>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>Admins</p>
                        <div className="chat-group-settings-admins">
                            {admins? admins: <p className="No-data">No Admin</p>}
                        </div>
                    </div>
                    <div className="chat-group-settings-clear-delete">
                        {<button onClick={() => setIsClearChatDialogOpen(true)}>Clear chat</button>}
                        {<button className="delete" onClick={() => setIsDeleteGroupDialogOpen(true)}>Delete group</button>}
                    </div>
                </div>
            </div>

            {isAddAdminDialogOpen && <Dialog    chatInfo={props.chatInfo}
                                                title="Add admin"
                                                closeDialog={() => setIsAddAdminDialogOpen(false)}
                                                update={update}
                                                setUpdate={setUpdate}
                                                membersData={props.membersData}
                                                setUpdatedAdmins={setUpdatedAdmins}/>}

            {isClearChatDialogOpen && <Dialog   title="Clear chat" 
                                                closeDialog={() => setIsClearChatDialogOpen(false)}
                                                chatInfo={props.chatInfo}
                                                closeGroupSetting={() => props.setIsChatSettingOpen(false)}/>}
            {isDeleteGroupDialogOpen && <Dialog title="Delete Group"
                                                closeDialog={() => setIsDeleteGroupDialogOpen(false)}
                                                chatInfo={props.chatInfo}
                                                setChat={props.setChat}
                                                closeGroupSetting={() => props.setIsChatSettingOpen(false)}/>}
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
                            Type: string, userId: number | null,
                            blocked?: boolean, whoblock?: number | null, muted?: string) => void,
    update:                 boolean,
    setUpdate:              (update: boolean) => void,
    closeArea:              () => void,
}

export const ChatAreaGroup = (props : ChatAreaGroupProps) => {
    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [membersWarn, setMembersWarn] = useState(false);

    useEffect(() => {
        Axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat/show-members/${props.chatInfo.chatId}`,
                {withCredentials: true})
            .then((response) => {
                if (response.data)
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
                                Content={<MemberCardPopOverContent  role={props.role}
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
                <div className="chat-area-group-close">
                    <p>Group Info</p>
                    <button onClick={props.closeArea}>
                        <FontAwesomeIcon 
                            className="x-mark" size="xl" icon={faXmark} 
                            style={{color: "#000000",}} />
                    </button>
                </div>
                <div className="chat-area-group-search">
                    <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
                {   searchQuery === '' ?
                        <div className="chat-area-group-owner">
                            <p className="header-role">Owner</p>
                            <PopoverComp    Trigger={<MemberCard   img={props.membersData?.owner.image}
                                                                username={props.membersData?.owner.username} />}
                                            Content={<MemberCardPopOverContent  role={''}
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
                    <p className="header-role">Admins</p>
                    <div className="chat-area-group-admins">
                        <div className="chat-area-group-admins-list">
                            {filteredAdmins && filteredAdmins.length !== 0 ? filteredAdmins: <p className="No-data">No admin</p>}
                        </div>
                    </div>

                    <div className="chat-area-group-members">
                        <p className="header-role">Members</p>
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
                    props.role == 'owner'?
                        <button className="chat-area-group-invite-btn" onClick={() => setIsInviteDialogOpen(true)}>
                            <p>Add member</p>
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
                                            setUpdate={props.setUpdate}
                                            setChat={props.setChat}/>}

            {isInviteDialogOpen && <Dialog  chatInfo={props.chatInfo}
                                            title="add member"
                                            closeDialog={() => setIsInviteDialogOpen(false)}
                                            update={props.update}
                                            setUpdate={props.setUpdate}
                                            membersWarn={membersWarn}
                                            setMembersWarn={setMembersWarn}/>}
        </div>
    );
}

type responseType = {
    sender:             number,
    room:               string,
    message:            string,
}

type ChatAreaProps = {
    chatInfo:           chatInfoType,
    setIsProfileOpen:   (isOpen: boolean) => void,
    setUpdateChatInfo:  (update: boolean) => void,
    setChat:            (Id: string, Image: string, Name: string,
                            Type: string, userId: number | null,
                            blocked?: boolean, whoblock?: number | null, muted?: string) => void,
    setUpdateUserCard:  (update: boolean) => void,
    updateUserCard:     boolean,
    updateChatInfo:     boolean,
    leaveRoom:          () => void,
}

export const ChatArea = ({chatInfo, setIsProfileOpen, setUpdateChatInfo,
                            setChat, setUpdateUserCard, updateUserCard,
                            updateChatInfo, leaveRoom} : ChatAreaProps) => {
    const [msgList, setmsgList] = useState<msgListType>([]);
    const [msgSend, setMsgSend] = useState(false);
    const me = useContext(userMe);
    const {socket} = useContext<any | undefined>(SocketContext);
    
    const sendingroup = (msg: string) => {
        if (socket) 
        {
            socket.emit('chatToServer', { sender: me?.id, room: chatInfo.chatId, message: msg });
        }
    }

    useEffect(() => {
        if (!chatInfo.chatId || chatInfo.mute !== 'NAN')
          return;
        Axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat/all-msg/`, {channelId: chatInfo.chatId}, 
                {withCredentials: true})
            .then((response) => {
                setmsgList(response.data || [])
              }
            )
            .catch((error) => {
                console.log(error);
              }
            );
      }, [chatInfo.chatId, updateChatInfo]);
    
    useEffect(() => {

        const chatToClientListener = (response: responseType) => {
            setmsgList(prevMsgList => [...prevMsgList, 
                                        {userId: response.sender,
                                        content: response.message,
                                        timeSend: new Date().toISOString(),
                                        image: chatInfo.chatImage}]);
            setUpdateUserCard(!updateUserCard);
            setUpdateChatInfo(!updateChatInfo);
        }

        if (socket)
            socket.on("chatToClient", chatToClientListener);

        return () => {
            if (socket) {
              socket.off("chatToClient", chatToClientListener);
            }
          };

    }, []);

    return (
        <div className='chat-area-container'>
            <ChatAreaHeader setIsProfileOpen={setIsProfileOpen} 
                            chatInfo={chatInfo}
                            setMsgSend={setMsgSend}
                            msgSend={msgSend}
                            setUpdateChatInfo={setUpdateChatInfo}
                            updateChatInfo={updateChatInfo}
                            setChat={setChat}
                            leaveRoom={leaveRoom}/>

            <ChatAreaMessages   ListOfMsg={msgList}
                                chatInfo={chatInfo}/>
            {
                chatInfo.blocked && me?.id === chatInfo.whoblock ? 
                    <p  className="No-data"
                        style={{textAlign: 'center', fontSize: '12px'}}>
                        You blocked this user
                    </p>
                : ''
            }
            {
                chatInfo.mute !== 'NAN' ?
                    <p  className="No-data"
                        style={{textAlign: 'center', fontSize: '12px'}}>
                        You are Muted from this group
                    </p>
                : ''
            }
            <ChatAreaInput  chatInfo={chatInfo}
                            sendingroup={sendingroup}
                            setUpdateChatInfo={setUpdateChatInfo}
                            updateChatInfo={updateChatInfo}
                            setChat={setChat}/>
        </div>
    );
}
