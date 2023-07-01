import React, { useEffect, useState, ChangeEvent } from 'react';
import * as radixDialog from '@radix-ui/react-dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faTriangleExclamation, faDisplay, faL } from '@fortawesome/free-solid-svg-icons' ;
import { Search } from './filterSearchSettings';
import DropMenu from './DropMenu';
import { friendDataType } from '../chatFriendList/friendList';
import './Dialog.css';
import Axios from 'axios';
import { chatInfoType } from '../chat';

type UserProps =
{
    user:               friendDataType,
    checkbox?:          boolean,
    setChat?:           (chatId: string, chatImage: string,
                        chatName: string, chatType: string, userId: number | null) => void
    closeDialog?:       () => void,
    GroupData?:         createGroupType,
    setMembersWarn?:    (membersWarn: boolean) => void,
    membersWarn?:        boolean,
    handleOnChange?:    (e: React.ChangeEvent<HTMLInputElement>
                            | { name: string; value: string }
                            | { name: string; value: string; isChecked: boolean }) => void,
}

const UsersCard = ({user, checkbox = false, setChat, closeDialog}: UserProps) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleOnClickCheckBox = () => {
        setIsChecked(!isChecked);

        Axios.post(`http://localhost:3000/chat/join-friend`,
                { receiverId: user.friend.id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                })
            .then((response) => {
                if (setChat )
                    setChat(response.data, user.friend.image, user.friend.username,
                            'PERSONEL', user.friend.id);
                if (closeDialog)
                    closeDialog();
            })
            .catch((error) => {
                console.log(error);
            }
            );
    }

    return (
        <div className="item" onClick={handleOnClickCheckBox}>
            <img src={user.friend.image} alt={`${user.friend.username} image`}/>
            <div>
                <div className='item-username-group-status-circle'>
                    <p className="item-username-group">{user.friend.username}</p>
                    <div className='status-circle online'></div>
                </div>
                <p className="item-last-message">online || offline</p>
            </div>
            {checkbox && (
                <div className='dialog-checkbox' >
                    <input  type="checkbox"
                            // id="username-of-the-user"
                            name="username-of-the-user"
                            checked={isChecked} 
                            onChange={()=>{}}/>
                </div>
            )}
        </div>
    );
}

type NewChatProps = {
    setChat?: (chatId: string, chatImage: string,
                chatName: string, chatType: string, userId: number | null) => void
    closeDialog?:       () => void,
}

const NewChat = ({setChat, closeDialog} : NewChatProps) => {
    const [friendList, setFriendList] = useState<friendDataType[] | null>(null);

    useEffect(()=>{
        Axios.get('http://localhost:3000/user/friends', { withCredentials: true })
        .then((response) => {
            setFriendList(response.data);
            
        })
        .catch((error) => {
                console.log(error);
            }
        );
    }, [friendList]);

    return (
        <>
            <div key="new-chat-search" className='new-chat-search'>
                <Search />
            </div>
            <div    key="new-chat-items" 
                    className='new-chat-items'>
                        {
                            friendList? friendList.map(user => <UsersCard key={user.friend.id} user={user} 
                                setChat={setChat} closeDialog={closeDialog} />) 
                            : <p>NO FRIENDS</p>
                        }
            </div>
        </>
    );
}

enum Type { PRIVATE = 'PRIVATE',
            PROTECTED = 'PROTECTED',
            PUBLIC = 'PUBLIC',
            PERSONEL = 'PERSONEL'};

type createGroupType = {
    type:       Type,
    name:       string,
    image:      string,
    hash:       string,
    members:    string[],
}

type CreateGroupFirstDialogProps = {
    GroupData:      createGroupType,
    nameExist:      boolean,
    nameWarn:       boolean,
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement> 
                    | { name: string; value: string }
                    | { name: string; value: string; isChecked: boolean }) => void,
}

export const CreateGroupFirstDialog = ({GroupData, nameExist, nameWarn, handleOnChange} : CreateGroupFirstDialogProps) =>
{
    const [privateKeyInput, setPrivateKeyInput] = useState(false);


    const handlegroupPrivacy = (type: string) => {
        setPrivateKeyInput(type === 'private');

        handleOnChange({ name: 'type', value: type === 'private'? Type.PRIVATE : Type.PUBLIC });
    }

    const {name, image, type, hash} = GroupData;

    return (   
        <>      
            <label className='dialog-label' key="group-name" >
                <div className='create-group-name-warn'>
                    <p className='dialog-MPLUS-font'>Group name</p>
                    {nameWarn?  <p className='create-group-warn-name'>
                                    {nameExist?
                                          "the group's name already exist"
                                        : "the group's name is mandatory"
                                    }
                                </p>
                            : ''
                    }
                </div>
                <input  className='dialog-input'
                        name='name'
                        value={name}
                        onChange={handleOnChange}
                        type='text'
                        autoComplete='off'
                        placeholder="Insert the group name" />
            </label>
            <div key="profile-img-upload">
                <p className='dialog-MPLUS-font'>Choose profile picture</p>
                <div className='browse-image-div'>
                    <input  className='browse-image-input'
                            name='image'
                            value={image}
                            type='file' 
                            id='profilePicture'
                            onChange={handleOnChange}/>
                    <label htmlFor="profilePicture" className='browse-image-label'>Browse</label>
                </div>
            </div>
            <label className='dialog-label' key="group-privacy" >
                <p className='dialog-MPLUS-font'>Group privacy</p>
                <div className='group-privacy-type'>
                    <div className='group-privacy-item' onClick={() => handlegroupPrivacy('public')}>
                        <input  type='radio'
                                id="public_group"
                                name="type"
                                value={type}
                                checked={!privateKeyInput}
                                onChange={()=>{}}/>
                        <label htmlFor="public_group">public group</label>
                    </div>
                    <div className='group-privacy-item' onClick={() => handlegroupPrivacy('private')}>
                        <input  type='radio'
                                id="private_group"
                                name="type"
                                value={type}
                                checked={privateKeyInput}
                                onChange={()=>{}}/>
                        <label htmlFor="private_group">private group</label>
                    </div>
                </div>
            </label>
            {   
                privateKeyInput && 
                <input  className='dialog-input private-key-input'
                        name='hash'
                        value={hash}
                        id='privateKey' 
                        type='text'
                        placeholder="Private key" 
                        onChange={handleOnChange}/>
            }
        </>
    );
}

const UsersList = ({user, checkbox = false, setMembersWarn, membersWarn, handleOnChange}: UserProps) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleOnClickCheckBox = () => {
        setIsChecked(!isChecked);
        if (setMembersWarn)
            setMembersWarn(false);
        if (handleOnChange)
            handleOnChange({name: 'members', value: user.friend.id.toString(), isChecked: !isChecked});
    }

    return (
        <div className="item" onClick={handleOnClickCheckBox}>
            <img src={user.friend.image} 
                alt={`${user.friend.username} image`}/>
            <div>
                <div className='item-username-group-status-circle'>
                    <p className="item-username-group">{user.friend.username}</p>
                    <div className='status-circle online'></div>
                </div>
                <p className="item-last-message">{'active | to be edited'}</p>
            </div>
            {checkbox && (
                <div className='dialog-checkbox'>
                    <input  type="checkbox"
                            name="members"
                            value={user.friend.id}
                            checked={isChecked}
                            onChange={() => {}}
                            />
                </div>
            )}
        </div>
    );
}


type CreateGroupSecondDialogProps = {
    GroupData:      createGroupType,
    membersWarn:    boolean,
    setMembersWarn: (membersWarn: boolean) => void,
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>
                    | { name: string; value: string }
                    | { name: string; value: string; isChecked: boolean }) => void,
}

const CreateGroupSecondDialog = ({GroupData, membersWarn, setMembersWarn, handleOnChange} : CreateGroupSecondDialogProps) => {
    const [friendListArray, setFriendListArray] = useState<friendDataType[] | null>(null);
    useEffect(() => {
        Axios.get('http://localhost:3000/user/friends', { withCredentials: true })
            .then((response) => {
                    setFriendListArray(response.data);
            })
            .catch((error) => {
                    console.log(error);
                }
            );
    }, []);
    
    return (
        <>
            <div key="create-group-search" className='create-group-search'>
            <Search />
            </div>
            <div className='create-group-members-warn'>
                {membersWarn? <p>please select at least one member</p>: ''}
            </div>
            <div    key="create-group-items" 
                    className='create-group-items'>
                        {friendListArray? 
                            friendListArray.map(friend => 
                                <UsersList
                                    membersWarn={membersWarn}
                                    setMembersWarn={setMembersWarn}
                                    GroupData={GroupData}
                                    handleOnChange={handleOnChange}
                                    key={friend.friend.id}
                                    user={friend}
                                    checkbox={true}/>)
                        : <p>NO FRIEND</p>}

                        {/* {friendListArray? 
                            friendListArray.map(friend => 
                                <UsersList
                                    membersWarn={membersWarn}
                                    setMembersWarn={setMembersWarn}
                                    GroupData={GroupData}
                                    handleOnChange={handleOnChange}
                                    key={friend.id}
                                    user={friend}
                                    checkbox={true}/>)
                        : <p>NO FRIEND</p>} */}
                        
            </div>
        </>
    );
}

const CreateGroupThirdDialog = () => {
    // TO BE EDITED
    return (
        <div className='dialog-success'>
            <FontAwesomeIcon icon={faCircleCheck} size="3x" style={{color: "#000000",}} />
            <p className='dialog-success-text'>Group Created Successfully</p>
        </div>
    );
}

const CreateGroup = ({closeDialog, setChat} : DialogProps) => {
    
    const   [showFirstDialog, setShowFirstDialog] = useState(true);
    const   [showSecondtDialog, setShowSecondtDialog] = useState(false);
    const   [showThirdDialog, setShowThirdDialog] = useState(false);
    let     [numberOfDailog, setNumberOfDailog] = useState(0);
    const   [nameWarn, setNameWarn] = useState(false);
    const   [nameExist, setNameExist] = useState(false);
    const   [membersWarn, setMembersWarn] = useState(false);
    const   [GroupData, setGroupData] = useState<createGroupType>({
            type: Type.PUBLIC,
            name: '',
            image: '',
            hash:'',
            members: [''],
        });

    useEffect((() => {
        Axios.get('http://localhost:3000/user/me', {withCredentials: true})
            .then((response) => {
                GroupData.members[0] = response.data.id;
            })
            .catch((error) => {
                console.log(error);
            })
    }), []);
    
    const checkNameInput = (groupName : string): boolean =>
    {
        if (GroupData.name === '')
            return true;

        const trimmedString = groupName.trim();
        if (!(trimmedString.length > 0))
            return true;    
        return false;
    }

    const checkIsNameExist = async (groupName : string): Promise<boolean> => {
        try
        {
            const response = await Axios.get(`http://localhost:3000/chat/NameGroupExist/${groupName}`,
                                    {withCredentials: true});
            return response.data;
        }
        catch(error)
        {
            console.log(error);
        }
        return false;
    }

    const handleNext = async (checkInput: boolean) => {

        if (checkInput && checkNameInput(GroupData.name))
            setNameWarn(true);
        else if (checkInput && await checkIsNameExist(GroupData.name))
        {
            setNameWarn(true);
            setNameExist(true);
        }
        else if (numberOfDailog <= 2)
        {
            setNumberOfDailog(++numberOfDailog);
            switch (numberOfDailog) {
                case 1:
                    setShowFirstDialog(false);
                    setShowSecondtDialog(true);
                    setShowThirdDialog(false);      
                    break;
                
                case 2:
                    setShowFirstDialog(false);
                    setShowSecondtDialog(false);
                    setShowThirdDialog(true);
                    break;

                default:
                    break;
            }
        }
        
    }

    const handlePrevious = () => {
        if (nameWarn)
            setNameWarn(false);
        if (nameExist)
            setNameExist(false);
        if (membersWarn)
            setMembersWarn(false);
        if (numberOfDailog > 2)
            numberOfDailog = 2;
        if (numberOfDailog >= 0)
        {
            setNumberOfDailog(--numberOfDailog);
            switch (numberOfDailog) {
                case 0:
                    setShowFirstDialog(true);
                    setShowSecondtDialog(false);
                    setShowThirdDialog(false);
                    break;

                case 1:
                    setShowFirstDialog(false);
                    setShowSecondtDialog(true);
                    setShowThirdDialog(false);     
                    break;

                default:
                    break;
            }
        }
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>
            | { name: string; value: string; isChecked: boolean }
            | { name: string; value: string; isChecked?: boolean }
            ) => {
        
        if (nameWarn)
            setNameWarn(false);
        if (nameExist)
            setNameExist(false);
        if ('target' in e)
        {
            const {name, value} = e.target;
            setGroupData({...GroupData, [name]: value});
            console.log('name: ', name, ', value: ', value);
        }
        else if (e.name == 'members')
        {
            const {name, value, isChecked} = e;
            // if (GroupData.members[0] === '')
            // {
            //     try
            //     {

                // }
                // const response = await Axios.get('http://localhost:3000/user/me', {withCredentials: true});
                // Axios.get('http://localhost:3000/user/me', {withCredentials: true})
                //     .then((response) => {
                //         setMyId(response.data.id);
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     })

            //     GroupData.members[0] = value.toString();
            //     return;
            // }

            const updatedMembers = isChecked ? 
                    [...GroupData.members, value.toString()]
                :   GroupData.members.filter(member => member !== value);

            console.log("isChecked: ", isChecked);
            console.log('updatedMembers: ', updatedMembers);
            setGroupData({...GroupData, [name]: updatedMembers});
        }
        else
        {
            const {name, value} = e;
            setGroupData({...GroupData, [name]: value});
            console.log('name: ', name, ', value: ', value);
        }
    }

    const  handleOnSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (GroupData.members.length > 1 && GroupData.members[0] != '')
        {
            const formData = new FormData();

            formData.append('type', GroupData.type);
            formData.append('name', GroupData.name);
            formData.append('hash', GroupData.hash)
            formData.append('image', GroupData.image);
            formData.append('members', JSON.stringify(GroupData.members));

            try
            {
                const response = await Axios.post("http://localhost:3000/chat/create-group", 
                                    formData, 
                                    { 
                                        withCredentials: true,
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                        }
                                    });
                console.log(response.data);
                handleNext(false);
                if (setChat)
                    setChat(response.data.id, response.data.image,
                            response.data.name, response.data.type);
            }
            catch(error)
            {
                console.log(error);
            }
        }
        else
            setMembersWarn(true);

    }

    return (
        <form onSubmit={handleOnSubmit}>
            {
                showFirstDialog && <CreateGroupFirstDialog nameExist={nameExist}  nameWarn={nameWarn} 
                                        GroupData={GroupData} handleOnChange={handleOnChange} />
                ||
                showSecondtDialog && <CreateGroupSecondDialog membersWarn={membersWarn} setMembersWarn={setMembersWarn} 
                                            GroupData={GroupData} handleOnChange={handleOnChange} />
                ||
                showThirdDialog && <CreateGroupThirdDialog />
            }
            {
                !showThirdDialog &&
                (<div className='dialog-process-btn' key="create-group-process">
                    <button className='cancel-btn' onClick={closeDialog}>Cancel</button>
                    <div className='dialog-Previous-next-btn'>
                        {!showFirstDialog && <button className='previous-btn' onClick={handlePrevious}>Previous</button>}
                        {!showThirdDialog && showFirstDialog && <button className='next-btn' type='button'
                            onClick={() => handleNext(true)}>Next</button>}
                        {!showThirdDialog && showSecondtDialog && <button className='next-btn' 
                            type='submit'>Submit</button>}
                    </div>
                </div>)
            }
        </form>
    );
}

const Invite = () => {
    const [showFirstDialog, setShowFirstDialog] = useState(true);
    const [showSecondDialog, setShowSecondDialog] = useState(false);

    const handleSendClick = () => {
        setShowSecondDialog(true);
        setShowFirstDialog(false);
    };

    return (
        <>
            {
                showFirstDialog &&
                    (<>
                        <label className='dialog-label' key="userName-emai" htmlFor="">
                            <p className='dialog-MPLUS-font'>User-Name Or Email</p>
                            <input className='dialog-MPLUS-font dialog-input' type='text' placeholder='Type here'/>
                        </label>
                        <label className='dialog-label' key="invitation-message" htmlFor="">
                            <p className='dialog-MPLUS-font'>Invitation message</p>
                            <input className='dialog-MPLUS-font dialog-input' type='text' placeholder='Type here'/>
                        </label>
                        <div className='dialog-invite' key="invitation-process">
                            <button className='send-btn' onClick={handleSendClick}>send</button>
                        </div>
                    </>)
                ||
                    showSecondDialog && 
                    (<div className='dialog-success'>
                        <FontAwesomeIcon icon={faCircleCheck} size="3x" style={{color: "#000000",}} />
                        <p className='dialog-success-text'>Invitation sent successfully</p>
                    </div>)
            }
        </>
    );
}

const LeaveGroup = ({closeDialog} : DialogProps) => {
    
    return (
        <div className='dialog-leave-group'>
            <FontAwesomeIcon icon={faTriangleExclamation} size='3x' style={{color: "#000000",}} />
            <p className='dialog-leave-group-msg'>Are you sure you want to Leave ?</p>
            <div className='dialog-leave-group-cancel-yes'>
                <button onClick={closeDialog}>Cancel</button>
                <button className='dialog-leave-group-yes-btn'>Yes</button>
            </div>
        </div>
    );
}

const RemoveMember = ({closeDialog} : DialogProps) => {
    
    return (
        <div className='dialog-remove-group'>
            <FontAwesomeIcon icon={faTriangleExclamation} size='3x' style={{color: "#000000",}} />
            <p className='dialog-remove-group-msg'>Are you sure you want to remove {'USERAME'} ?</p>
            <div className='dialog-remove-group-cancel-yes'>
                <button onClick={closeDialog}>Cancel</button>
                <button className='dialog-remove-group-yes-btn'>Yes</button>
            </div>
        </div>
    );
}

const MuteMember = ({closeDialog} : DialogProps) => {

    const MuteTime= ['45 min', '1 Hour', '4 Hour', '8 Hour', 'Forever'];

    return (
        <div className='dialog-mute-group'>
            <div className='dialog-mute-group-dropmenu'>
                <DropMenu list={MuteTime} triggerIconSize='15px' />
            </div>
            <FontAwesomeIcon icon={faTriangleExclamation} size='3x' style={{color: "#000000",}} />
            <p className='dialog-mute-group-msg'>Are you sure you want to mute {'USERAME'} ?</p>
            <div className='dialog-mute-group-cancel-yes'>
                <button onClick={closeDialog}>Cancel</button>
                <button className='dialog-mute-group-yes-btn'>Yes</button>
            </div>
        </div>
    );
}

const AddAdmin = ({closeDialog} : DialogProps) => {
    const [showFirstDialog, setShowFirstDialog] = useState(true);
    const [showSecondDialog, setShowSecondDialog] = useState(false);

    const handleAddOnClick = () => {
        setShowSecondDialog(true);
        setShowFirstDialog(false);
    };

    return (
        <>
            {
                showFirstDialog &&
                    (<>
                        <label className='dialog-label' key="userName-emai" htmlFor="">
                            <p className='dialog-MPLUS-font'>User-Name Or Email</p>
                            <input className='dialog-MPLUS-font dialog-input' type='text' placeholder='Type here'/>
                        </label>
                        
                        <div className='dialog-process-btn' key="create-group-process">
                            <button className='cancel-btn' onClick={closeDialog}>Cancel</button>
                            <div className='dialog-Previous-next-btn'>
                                <button className='next-btn' onClick={handleAddOnClick}>Add</button>
                            </div>
                        </div>
                    </>)
                ||
                    showSecondDialog && 
                    (<div className='dialog-success'>
                        <FontAwesomeIcon icon={faCircleCheck} size="3x" style={{color: "#000000",}} />
                        <p className='dialog-success-text'>Added successfully</p>
                    </div>)
            }
        </>
    );
}

const ClearChat = ({closeDialog, chatInfo, title, setMsgSend, msgSend} : DialogProps) => {

    const handleOnClickYes = () => {
        if (!chatInfo)
            return;
        Axios.post("http://localhost:3000/chat/friend/delet-chat",
            {channelId: chatInfo.chatId},
            {withCredentials: true})
            .then((response) => {
                console.log('response: ', response);
                console.log('before: ', msgSend);
                if (setMsgSend)
                    setMsgSend(!msgSend);
                    console.log('after: ', msgSend);
                if (closeDialog)
                    closeDialog();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className='dialog-remove-group'>
            <FontAwesomeIcon icon={faTriangleExclamation} size='3x' style={{color: "#000000",}} />
            <p className='dialog-remove-group-msg'>
                Are you sure you want to {title === 'Delete'? 'delete' : 'clear'} {chatInfo?.chatName}'s chat ?
            </p>
            <div className='dialog-remove-group-cancel-yes'>
                <button onClick={closeDialog}>Cancel</button>
                <button className='dialog-remove-group-yes-btn' onClick={handleOnClickYes}>Yes</button>
            </div>
        </div>
    );
}

const DeleteGroup = ({closeDialog} : DialogProps) => {

    return (
        <div className='dialog-remove-group'>
            <FontAwesomeIcon icon={faTriangleExclamation} size='3x' style={{color: "#000000",}} />
            <p className='dialog-remove-group-msg'>Are you sure you want to delete {'GROUPNAME'} group ?</p>
            <div className='dialog-remove-group-cancel-yes'>
                <button onClick={closeDialog}>Cancel</button>
                <button className='dialog-remove-group-yes-btn'>Yes</button>
            </div>
        </div>
    );
}

type DialogProps =
{
    title?:         string;
    closeDialog?:   () => void;
    setChat?:       (chatId: string, chatImage: string,
                        chatName: string, chatType: string, userId: number | null) => void,
    chatInfo?:      chatInfoType,
    msgSend?:        boolean,
    setMsgSend?:     (msgSend: boolean) => void,
}

export function Dialog({title, closeDialog, setChat,
                        chatInfo, msgSend, setMsgSend} : DialogProps)
{
    // 'New Chat', 'Create Group', 'Invite', 'Leave Group'...
    let ItemComponent :React.ComponentType = () => <p>Invalid Choise</p>;

    switch(title)
    {
        case 'New Chat':
            ItemComponent = () => <NewChat setChat={setChat} closeDialog={closeDialog} />;
            break;
        
        case 'Create Group':
            ItemComponent = () =>  <CreateGroup setChat={setChat} closeDialog={closeDialog} />;
            break;

        // case 'Invite':
        //     ItemComponent = dialogContent.invite;
        //     break;

        // case 'Leave Group':
        //     ItemComponent = dialogContent.leaveGroup;
        //     break;
        
        // case 'Remove Member':
        //     ItemComponent = dialogContent.removeMember;
        //     break;
        
        // case 'Mute Member':
        //     ItemComponent = dialogContent.muteMember;
        //     break;
        
        // case 'Add Admin':
        //     ItemComponent = dialogContent.addAdmin;
        //     break;

        case 'Delete':
            ItemComponent = () => <ClearChat    chatInfo={chatInfo}
                                                closeDialog={closeDialog}
                                                title={title}
                                                setMsgSend={setMsgSend}
                                                msgSend={msgSend}/>;
            break;

        case 'Clear Chat':
            ItemComponent = () => <ClearChat />;
            break;

        // case 'Delete Group':
        //     ItemComponent = dialogContent.deleteGroup;
        //     break;
        
        default:
            // item not on the list
            break;
    }
    
    return (
            <radixDialog.Root open={true}>
                <radixDialog.Portal>
                    <radixDialog.Overlay className="DialogOverlay" onClick={closeDialog} />
                    <radixDialog.Content className="DialogContent">
                        <div className='DialogTitle-container'>
                            <radixDialog.Title className="DialogTitle">{title}</radixDialog.Title>
                            <radixDialog.Close asChild>
                                <button className="IconButton" aria-label="Close" onClick={closeDialog}>
                                    <FontAwesomeIcon icon={faXmark} style={{color: "#000000",}} />
                                </button>
                            </radixDialog.Close>
                        </div>
                        <ItemComponent />
                    </radixDialog.Content>
                </radixDialog.Portal>
            </radixDialog.Root>
    );
}
