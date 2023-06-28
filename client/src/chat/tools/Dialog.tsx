import React, { useEffect, useState } from 'react';
import * as radixDialog from '@radix-ui/react-dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons' ;
import { Search } from './filterSearchSettings';
import DropMenu from './DropMenu';

import Image from '../barae.jpg';
import './Dialog.css';

interface DialogProps
{
    title?: string;
    closeDialog?: () => void;
}

interface User 
{
    id: number,
    userName: string,
    status: string,
    img: string
    description: string
}
interface UserProps
{
    user: User,
    checkbox?: boolean
}

const allUsers = [
    {id:0, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:1, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:2, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:3, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:4, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:5, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:6, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:7, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:8, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:9, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:10, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:11, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:12, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:13, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:14, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:15, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:16, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:17, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:18, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:19, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:20, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:21, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:22, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:23, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:24, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:25, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:26, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:27, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:28, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:29, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:30, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:31, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:32, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:33, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:34, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:35, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:36, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:37, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:38, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:39, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:40, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:41, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:42, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:43, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:44, userName:'barae', status:'online', img:Image, description:"profile image"},
    {id:45, userName:'barae', status:'online', img:Image, description:"profile image"},

];

const UsersList = ({user, checkbox = false}: UserProps) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleOnClickCheckBox = () => {
        setIsChecked(!isChecked);
    }

    return (
        <div className="item" onClick={handleOnClickCheckBox}>
            <img src={user.img} alt={user.description}/>
            <div>
                <div className='item-username-group-status-circle'>
                    <p className="item-username-group">{user.userName}</p>
                    <div className='status-circle online'></div>
                </div>
                <p className="item-last-message">{user.status}</p>
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

const NewChat = () => {

    return (
        <>
            <div key="new-chat-search" className='new-chat-search'>
            <Search />
            </div>
            <div    key="new-chat-items" 
                    className='new-chat-items'>
                        {allUsers.map(user => <UsersList key={user.id} user={user} />)}
            </div>
        </>
    );
}

export const CreateGroupFirstDialog = () =>
{
    const [privateKeyInput, setPrivateKeyInput] = useState(false);

    const handlegroupPrivacy = (type: string) => {
        setPrivateKeyInput(type === 'private');
    }

    return (   
        <>      
            <label className='dialog-label' key="group-name" /*htmlFor=""*/>
                <p className='dialog-MPLUS-font'>Group name</p>
                <input className='dialog-input' type='text' placeholder="Insert the group name" />
            </label>
            <div key="profile-img-upload">
                <p className='dialog-MPLUS-font'>Choose profile picture</p>
                <div className='browse-image-div'>
                    <input type='file' id='fileInput' className='browse-image-input'/>
                    {/* <input type='text' className='dialog-input' placeholder='No file chosen' readOnly/> */}
                    <label htmlFor="fileInput" id="fileInputLabel" className='browse-image-label'>Browse</label>
                </div>
            </div>
            <label className='dialog-label' key="group-privacy" /*htmlFor=""*/>
                <p className='dialog-MPLUS-font'>Group privacy</p>
                <div className='group-privacy-type'>
                    <div className='group-privacy-item' onClick={() => handlegroupPrivacy('public')}>
                        <input  type='radio'
                                id="public_group" 
                                name="group_privacy" 
                                value="public group"
                                checked={!privateKeyInput}
                                onChange={() => {}}/>
                        <label htmlFor="public_group">public group</label>
                    </div>
                    <div className='group-privacy-item' onClick={() => handlegroupPrivacy('private')}>
                        <input  type='radio'
                                id="private_group"
                                name="group_privacy"
                                value="private group"
                                checked={privateKeyInput}
                                onChange={() => {}}/>
                        <label htmlFor="private_group">private group</label>
                    </div>
                </div>
            </label>
            {   
                privateKeyInput && 
                <input className='dialog-input private-key-input' key="private-key-input" type='text' placeholder="Private key"/>
            }
        </>
    );
}

const CreateGroupSecondDialog = () => {
    // TO BE EDITED
    return (
        <>
            <div key="create-group-search" className='create-group-search'>
            <Search />
            </div>
            <div    key="create-group-items" 
                    className='create-group-items'>
                        {allUsers.map(user => <UsersList key={user.id} user={user} checkbox={true}/>)}
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

const CreateGroup = ({closeDialog} : DialogProps) => {
    const [showFirstDialog, setShowFirstDialog] = useState(true);
    const [showSecondtDialog, setShowSecondtDialog] = useState(false);
    const [showThirdDialog, setShowThirdDialog] = useState(false);
    
    let [numberOfDailog, setNumberOfDailog] = useState(0);

    const handleNext = () => {
        if (numberOfDailog <= 2)
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

    return (
        <>
            {
                showFirstDialog && <CreateGroupFirstDialog />
                ||
                showSecondtDialog && <CreateGroupSecondDialog />
                ||
                showThirdDialog && <CreateGroupThirdDialog />
            }
            {
                !showThirdDialog &&
                (<div className='dialog-process-btn' key="create-group-process">
                    <button className='cancel-btn' onClick={closeDialog}>Cancel</button>
                    <div className='dialog-Previous-next-btn'>
                        {!showFirstDialog && <button className='previous-btn' onClick={handlePrevious}>Previous</button>}
                        {!showThirdDialog && <button className='next-btn' onClick={handleNext}>{showSecondtDialog? 'Submit' : 'Next'}</button>}
                    </div>
                </div>)
            }
        </>
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

const ClearChat = ({closeDialog} : DialogProps) => {

    return (
        <div className='dialog-remove-group'>
            <FontAwesomeIcon icon={faTriangleExclamation} size='3x' style={{color: "#000000",}} />
            <p className='dialog-remove-group-msg'>Are you sure you want to clear {'GROUPNAME'}'s chat ?</p>
            <div className='dialog-remove-group-cancel-yes'>
                <button onClick={closeDialog}>Cancel</button>
                <button className='dialog-remove-group-yes-btn'>Yes</button>
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

const dialogContent = {
    newChat: NewChat,
    createGroup: CreateGroup,
    invite: Invite,
    leaveGroup: LeaveGroup,
    removeMember: RemoveMember,
    muteMember: MuteMember,
    addAdmin: AddAdmin,
    clearChat: ClearChat,
    deleteGroup: DeleteGroup
};

export function Dialog({title, closeDialog} : DialogProps): JSX.Element | null
{
    let ItemComponent; // 'New Chat', 'Create Group', 'Invite', 'Leave Group'

    switch(title)
    {
        case 'New Chat':
            ItemComponent = dialogContent.newChat;
            break;
        
        case 'Create Group':
            ItemComponent = dialogContent.createGroup;
            break;

        case 'Invite':
            ItemComponent = dialogContent.invite;
            break;

        case 'Leave Group':
            ItemComponent = dialogContent.leaveGroup;
            break;
        
        case 'Remove Member':
            ItemComponent = dialogContent.removeMember;
            break;
        
        case 'Mute Member':
            ItemComponent = dialogContent.muteMember;
            break;
        
        case 'Add Admin':
            ItemComponent = dialogContent.addAdmin;
            break;

        case 'Clear Chat':
            ItemComponent = dialogContent.clearChat;
            break;

        case 'Delete Group':
            ItemComponent = dialogContent.deleteGroup;
            break;
        
        default:
            // item not on the list
            return null;
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
                        <ItemComponent closeDialog={closeDialog} />
                    </radixDialog.Content>
                </radixDialog.Portal>
            </radixDialog.Root>
    );
}
