import React, { useEffect, useState, ChangeEvent, useContext } from 'react';
import * as radixDialog from '@radix-ui/react-dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faTriangleExclamation, faDisplay, faL } from '@fortawesome/free-solid-svg-icons' ;
import { Search } from './filterSearchSettings';
import DropMenu from './DropMenu';
import { friendDataType } from '../chatFriendList/friendList';
import './Dialog.css';
import Axios from 'axios';
import { chatInfoType, membersDataType, updateChatInfoCntext } from '../chat';
import defaultUserImage from '../../assets/person.png';
import defaultGroupImage from '../../assets/group.png';
import { userMe } from '../../App';

type UserProps =
{
    user:               {id: number, image: string, username: string},
    checkbox?:          boolean,
    setChat?:           (chatId: string, chatImage: string,
                        chatName: string, chatType: string, userId: number | null) => void
    closeDialog?:       () => void,
    GroupData?:         createGroupType,
    setMembersWarn?:    (membersWarn: boolean) => void,
    membersWarn?:        boolean,
    handleOnChange?:    (e: React.ChangeEvent<HTMLInputElement>
                            | { name: string; value: string }
                            | { name: string; value: string; isChecked: boolean }
                            | { id: number; isChecked: boolean}) => void,
    type?:               string,
}

const UsersCard = ({user, checkbox = false, setChat, closeDialog}: UserProps) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleOnClickCheckBox = () => {
        setIsChecked(!isChecked);

        Axios.post(`http://localhost:3000/chat/join-friend`,
                { receiverId: user.id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                })
            .then((response) => {
                if (setChat )
                    setChat(response.data.channelID, user.image, user.username,
                            'PERSONEL', user.id);
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
            <img src={user.image} alt={`${user.username} image`}/>
            <div>
                <div className='item-username-group-status-circle'>
                    <p className="item-username-group">{user.username}</p>
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
    const [usersList, setUsersList] = useState<userListType[] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(()=>{
        Axios.get('http://localhost:3000/chat/show-all-users',
            { withCredentials: true })
        .then((response) => {
            setUsersList(response.data);
        })
        .catch((error) => {
                console.log(error);
            }
        );
    }, []);

    const filteredUsersList = usersList
        ? usersList.filter((user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
            )
        : usersList;
 
    return (
        <>
            <div key="new-chat-search" className='new-chat-search'>
                <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            <div    key="new-chat-items" 
                    className='new-chat-items'>
                        {
                            filteredUsersList && filteredUsersList.length !== 0 ? 
                                filteredUsersList.map(user => <UsersCard    key={user.id}
                                                                            user={user}     
                                                                            setChat={setChat}
                                                                            closeDialog={closeDialog} />) 
                            : <p className='No-data' style={{textAlign: 'center'}}>NO RESULT</p>
                        }
            </div>
        </>
    );
}

export enum Type { PRIVATE = 'PRIVATE',
            PROTECTED = 'PROTECTED',
            PUBLIC = 'PUBLIC',
            PERSONEL = 'PERSONEL'};

export type createGroupType = {
    type:       Type,
    name:       string,
    image:      File | null,
    hash:       string,
    members:    string[],
}

type CreateGroupFirstDialogProps = {
    GroupData:          createGroupType,
    nameExist?:         boolean,
    nameWarn?:          boolean,
    fileWarn?:          boolean,
    handleOnChange:     (e: React.ChangeEvent<HTMLInputElement> 
                        | { name: string; value: string }
                        | { name: string; value: string; isChecked: boolean }) => void,
    
}

export const CreateGroupFirstDialog = ({GroupData, nameExist, nameWarn,
                                        fileWarn, handleOnChange} : CreateGroupFirstDialogProps) =>
{
    const [privateKeyInput, setPrivateKeyInput] = useState(false);

    const handlegroupPrivacy = (type: string) => {
        setPrivateKeyInput(type === 'private');

        handleOnChange({ name: 'type', value: type === 'private'? Type.PRIVATE : Type.PUBLIC });
    }

    const {name, type, hash} = GroupData;

    return (
        <>
            <div className='dialog-label' key="group-name" >
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
            </div>
            <div key="profile-img-upload">
                <p className='dialog-MPLUS-font'>Choose profile picture</p>
                {
                    fileWarn ?  <p className='create-group-warn-name'>
                                    image type allowed: (png, jpg or jpeg)
                                </p>
                    : ''
                }
                <div className='browse-image-div'>
                    <input  className='browse-image-input'
                            name='image'
                            type='file' 
                            accept='.png, .jpg, .jpeg'
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
                        id='privateKey' 
                        max='12'
                        name='hash'
                        value={hash}
                        type='password'
                        placeholder="Private key" 
                        onChange={handleOnChange}/>
            }
        </>
    );
}

const UsersList = ({user, checkbox = false, handleOnChange, type}: UserProps) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleOnClickCheckBox = () => {
        setIsChecked(!isChecked);

        if (handleOnChange)
        {
            type === 'add' || type === 'add member' ?
                handleOnChange({id: user.id, isChecked: !isChecked})
            : handleOnChange({name: 'members', value: user.id.toString(), isChecked: !isChecked});

        }
    }

    return (
        <div className="item" onClick={handleOnClickCheckBox}>
            <img    src={user.image} 
                    alt={`${user.username} image`}/>
            <div>
                <div className='item-username-group-status-circle'>
                    <p className="item-username-group">{user.username}</p>
                    <div className='status-circle online'></div>
                </div>
                <p className="item-last-message">{'active | to be edited'}</p>
            </div>
            {checkbox && (
                <div className='dialog-checkbox'>
                    <input  type="checkbox"
                            name="members"
                            value={user.id}
                            checked={isChecked}
                            onChange={() => {}}
                            />
                </div>
            )}
        </div>
    );
}

type CreateGroupSecondDialogProps = {

    GroupData?:         createGroupType,
    membersWarn?:       boolean,
    setMembersWarn?:    (membersWarn: boolean) => void,
    handleOnChange?:    (e: React.ChangeEvent<HTMLInputElement>
                            | { name: string; value: string }
                            | { name: string; value: string; isChecked: boolean }
                            | { id: number; isChecked: boolean}) => void,
    type?:              string,
    chatInfo?:          chatInfoType,
    closeDialog?:       () => void,
    update?:            boolean,
    setUpdate?:         (update: boolean) => void,  
}

type userListType = {
    id:         number,
    username:   string,
    image:      string,
}

type usersDataType = {
    otheruserid:    number[],
}

const CreateGroupSecondDialog = ({  GroupData, handleOnChange, type,
                                    chatInfo, closeDialog, update,
                                    setUpdate, membersWarn, setMembersWarn} : CreateGroupSecondDialogProps) => {
    const [userListArray, setUserListArray] = useState<userListType[] | null>(null);
    const [usersData, setUsersData] = useState< usersDataType>({ otheruserid: [] });
    const [searchQuery, setSearchQuery] = useState('');
    // const [membersWarn, setMembersWarn]= useState(false);

    useEffect(() => {
        Axios.get('http://localhost:3000/chat/show-all-users',
                { withCredentials: true })
            .then((response) => {
                    setUserListArray(response.data);
                })
            .catch((error) => {
                    console.log(error);
                }
            );
    }, []);

    const handleOnChangeUsers = (e: React.ChangeEvent<HTMLInputElement>
                                    | { name: string; value: string }
                                    | { name: string; value: string; isChecked: boolean }
                                    | { id: number; isChecked: boolean }) => {

        // if (membersWarn && setMembersWarn)
        //     setMembersWarn(false);

        if ('id' in e)
        {
        
            const {id, isChecked} = e;

            setUsersData((prevState) => {
                const updatedMembers = isChecked
                  ? [...prevState.otheruserid, id]
                  : prevState.otheruserid.filter((memberId) => memberId !== id);
          
                return {
                  ...prevState,
                  otheruserid: updatedMembers,
                };
              });
        }
    }

    const handleAddMember = (e: React.SyntheticEvent) => {
        e.preventDefault();
    
        if (chatInfo && usersData.otheruserid.length > 0)
        {
            Axios.post("http://localhost:3000/chat/invite-user",
                {   
                    channelId:      chatInfo.chatId,
                    otheruserid:    usersData.otheruserid,
                },
                {withCredentials: true})
            .then(() => {
                if (setUpdate)
                    setUpdate(!update);
            })
            .catch((error) => {
                console.log(error);
            })
        }
        else
        {
            if (setMembersWarn)
                    setMembersWarn(true);
            return;
        }

        if (closeDialog)
            closeDialog();
    }

    const filteredUserListArray = userListArray?.filter((user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        ) ;

        // console.log('membersWarn: ', membersWarn);


    return (
        <>
            <div key="create-group-search" className='create-group-search'>
                <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            <div className='create-group-members-warn'>
                {membersWarn? <p>please select at least one member</p>: ''}
            </div>
            <div    key="create-group-items" 
                    className='create-group-items'>
                        {
                            filteredUserListArray? 
                                filteredUserListArray.map(user => 
                                    <UsersList
                                        setMembersWarn={setMembersWarn}
                                        membersWarn={membersWarn}
                                        GroupData={GroupData}
                                        handleOnChange={type == 'add member' ?
                                                            handleOnChangeUsers
                                                        : handleOnChange}
                                        key={user.id}
                                        user={user}
                                        checkbox={true}
                                        type={type}/>)
                            : <p className="No-data" style={{textAlign: 'center'}}>NO FRIEND</p>
                        }
            </div>
            {
                type == 'add member' ?
                    <div className='dialog-invite' key="invitation-process">
                        <button className='send-btn' type='submit' onClick={handleAddMember} >add</button>
                    </div>
                : ''
            }
        </>
    );
}

// const CreateGroupThirdDialog = () => {

//     return (
//         <div className='dialog-success'>
//             <FontAwesomeIcon icon={faCircleCheck} size="3x" style={{color: "#000000",}} />
//             <p className='dialog-success-text'>Group Created Successfully</p>
//         </div>
//     );
// }

const CreateGroup = ({closeDialog, setChat} : DialogProps) => {
    
    const   [showFirstDialog, setShowFirstDialog] = useState(true);
    const   [showSecondtDialog, setShowSecondtDialog] = useState(false);
    let     [numberOfDailog, setNumberOfDailog] = useState(0);
    const   [nameWarn, setNameWarn] = useState(false);
    const   [nameExist, setNameExist] = useState(false);
    const   [fileWarn, setFileWarn] = useState(false);
    const   [membersWarn, setMembersWarn] = useState(false);
    const   [GroupData, setGroupData] = useState<createGroupType>({
            type: Type.PUBLIC,
            name: '',
            image: null,
            hash:'',
            members: [''],
        });
    const me = useContext(userMe);


    if (me && GroupData.members !== null)
        GroupData.members[0] = me.id.toString();
    
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

    const checkFileType = (file: File | null): boolean => {
        if (!file)
            return false;
        
        const fileType = file.type;
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

        if (!allowedTypes.includes(fileType))
            return true;
        
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
        else if (checkFileType(GroupData.image))
            setFileWarn(true);
        else if (numberOfDailog <= 2)
        {
            setNumberOfDailog(++numberOfDailog);
            switch (numberOfDailog) {
                case 1:
                    {
                        setShowFirstDialog(false);
                        setShowSecondtDialog(true);
                        break;
                    }
                
                case 2:
                    {
                        setShowFirstDialog(false);
                        setShowSecondtDialog(false);
                        if (closeDialog)
                                closeDialog();
                        break;
                    }

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
        if (numberOfDailog > 1)
            numberOfDailog = 1;
        if (numberOfDailog >= 0)
        {
            setNumberOfDailog(--numberOfDailog);
            switch (numberOfDailog) {
                case 0:
                    setShowFirstDialog(true);
                    setShowSecondtDialog(false);
                    GroupData.members = [''];
                    break;

                case 1:
                    setShowFirstDialog(false);
                    setShowSecondtDialog(true);
                    break;

                default:
                    break;
            }
        }
    }

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
                setGroupData({ ...GroupData, [name]: file });
            }
            else
                setGroupData({ ...GroupData, [name]: value });
        }
        else if ( 'name' in e && e.name == 'members')
        {
            const {name, value, isChecked} = e;
            const updatedMembers = isChecked ? 
                    [...GroupData.members, value.toString()]
                :   GroupData.members.filter(member => member !== value);

            setGroupData({...GroupData, [name]: updatedMembers});
        }
        else if ('name' in e)
        {
            const {name, value} = e;
            setGroupData({...GroupData, [name]: value});
        }
    }

    const  handleOnSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (GroupData.members.length > 1 && 
            GroupData.members[0] !== '')
        {    
            const formData = new FormData();

            formData.append('type', GroupData.type);
            formData.append('name', GroupData.name);
            formData.append('hash', GroupData.hash)
            formData.append('members', JSON.stringify(GroupData.members));
            if (GroupData.image !== null)
                formData.append('image', GroupData.image);

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
                if (setChat)
                    setChat(response.data.id, response.data.image? response.data.image :defaultGroupImage,
                            response.data.name, response.data.type, null);
            }
            catch(error)
            {
                console.log(error);
            }
            handleNext(false);
        }
        else
            setMembersWarn(true);
    }

    return (
        <form onSubmit={handleOnSubmit} className='create-group-form'>
            {
                showFirstDialog && <CreateGroupFirstDialog  nameExist={nameExist}
                                                            nameWarn={nameWarn}
                                                            fileWarn={fileWarn}
                                                            GroupData={GroupData}
                                                            handleOnChange={handleOnChange} />
                ||
                showSecondtDialog && <CreateGroupSecondDialog   membersWarn={membersWarn}
                                                                setMembersWarn={setMembersWarn} 
                                                                GroupData={GroupData}
                                                                handleOnChange={handleOnChange}
                                                                type='create group' />
            }
            <div className='dialog-process-btn' key="create-group-process">
                <button className='cancel-btn' onClick={closeDialog}>Cancel</button>
                <div className='dialog-Previous-next-btn'>
                    {!showFirstDialog && <button    className='previous-btn' 
                                                    onClick={handlePrevious}>Previous</button>}

                    {showFirstDialog && <button className='next-btn' 
                                                type='button'
                                                onClick={() => handleNext(true)}>Next</button>}

                    {showSecondtDialog && <button   className='next-btn' 
                                                    type='submit'>Submit</button>}
                </div>
            </div>
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

const LeaveGroup = ({closeDialog, chatInfo, setChat} : DialogProps) => {
    
    const handleOnClick = () => {
        if (chatInfo === undefined)
            return;
        Axios.post("http://localhost:3000/chat/leave-group",
                {   
                    channelid:  chatInfo.chatId,
                },
                {withCredentials: true})
            .then(() => {
                if (setChat)
                    setChat('', '', '', '', null);
                if (closeDialog)
                    closeDialog();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className='dialog-leave-group'>
            <FontAwesomeIcon icon={faTriangleExclamation} size='3x' style={{color: "#000000",}} />
            <p className='dialog-leave-group-msg'>Are you sure you want to Leave ?</p>
            <div className='dialog-leave-group-cancel-yes'>
                <button onClick={closeDialog}>Cancel</button>
                <button className='dialog-leave-group-yes-btn' onClick={handleOnClick}>Yes</button>
            </div>
        </div>
    );
}

const RemoveMember = ({closeDialog, chatInfo, setUpdate, update} : DialogProps) => {

    const HandleRemove = () => {
        Axios.post('http://localhost:3000/chat/setting/remove-member',
            {
                otheruser:  chatInfo?.chatUserId,
                channelid:  chatInfo?.chatId,
            },
            {withCredentials: true})
            .then(() => {
                if (setUpdate)
                    setUpdate(!update);
            })
            .catch((error) => {
                console.log(error);
            })
        if (closeDialog)
            closeDialog();
    }

    return (
        <div className='dialog-remove-group'>
            <FontAwesomeIcon icon={faTriangleExclamation} size='3x' style={{color: "#000000",}} />
            <p className='dialog-remove-group-msg'>Are you sure you want to remove {'USERAME'} ?</p>
            <div className='dialog-remove-group-cancel-yes'>
                <button onClick={closeDialog}>Cancel</button>
                <button className='dialog-remove-group-yes-btn' onClick={HandleRemove}>Yes</button>
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

const AddAdmin = ({closeDialog, chatInfo, membersData, setUpdatedAdmins} : DialogProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [membersWarn, setMembersWarn] = useState(false);
    const [usersData, setUsersData] = useState<usersDataType>({ otheruserid: [] });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>
                            | { name: string; value: string }
                            | { name: string; value: string; isChecked: boolean }
                            | { id: number; isChecked: boolean }) => {

        if (membersWarn && setMembersWarn)
            setMembersWarn(false);

        if ('id' in e)
        {
            const {id, isChecked} = e;

            setUsersData((prevState) => {
                const updatedMembers = isChecked ?
                                        [...prevState.otheruserid, id]
                                    : prevState.otheruserid.filter((memberId) => memberId !== id);

                return {
                    ...prevState,
                    otheruserid: updatedMembers,
                };
            });
        }
    }

    const handleAdd = (e: React.SyntheticEvent) => {
        e.preventDefault;

        if (usersData.otheruserid.length === 0)
        {
            setMembersWarn(true)
            return;
        }
        if (chatInfo)
        {
            Axios.post("http://localhost:3000/chat/setting/add-admin",
                {   
                    channelid:      chatInfo.chatId,
                    role:           'ADMIN',
                    otheruser:    usersData.otheruserid[0], // mutiple users | to be edited
                },
                {withCredentials: true})
            .then(() => {
                if (setUpdatedAdmins)
                    setUpdatedAdmins(true);
                if (closeDialog)
                    closeDialog();
            })
            .catch((error) => {
                console.log(error);
                if (closeDialog)
                    closeDialog();
            })
        }

    }

    const filteredMembers = membersData?
                                membersData.users?
                                    membersData.users.filter((member) =>
                                        member.username.toLowerCase().includes(searchQuery.toLowerCase()))
                                : null
                            : null

    return (
        <>
            <div key="create-group-search" className='create-group-search'>
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            <div className='create-group-members-warn'>
                {membersWarn? <p>please select at least one member</p>: ''}
            </div>
            <div    key="create-group-items" 
                    className='create-group-items'>
                        {
                            filteredMembers? 
                                filteredMembers.map(member => 
                                    <UsersList
                                        membersWarn={membersWarn}
                                        setMembersWarn={setMembersWarn}
                                        handleOnChange={handleOnChange}
                                        key={member.id}
                                        user={member}
                                        checkbox={true}
                                        type='add'/>)
                            : <p className='No-data' style={{textAlign: 'center'}}>No member</p>
                        }
            </div>
            <div className='dialog-process-btn' key="create-group-process">
                <button className='cancel-btn' onClick={closeDialog}>Cancel</button>
                <div className='dialog-Previous-next-btn'>
                    <button className='next-btn' type='submit' onClick={handleAdd}>Add</button>
                </div>
            </div>
        </>
        // <>
        //     {
        //         showFirstDialog &&
        //             (<>
        //                 <label className='dialog-label' key="userName-emai" htmlFor="">
        //                     <p className='dialog-MPLUS-font'>User-Name Or Email</p>
        //                     <input className='dialog-MPLUS-font dialog-input' type='text' placeholder='Type here'/>
        //                 </label>
                        
        //                 <div className='dialog-process-btn' key="create-group-process">
        //                     <button className='cancel-btn' onClick={closeDialog}>Cancel</button>
        //                     <div className='dialog-Previous-next-btn'>
        //                         <button className='next-btn' onClick={handleAddOnClick}>Add</button>
        //                     </div>
        //                 </div>
        //             </>)
        //         ||
        //             showSecondDialog && 
        //             (<div className='dialog-success'>
        //                 <FontAwesomeIcon icon={faCircleCheck} size="3x" style={{color: "#000000",}} />
        //                 <p className='dialog-success-text'>Added successfully</p>
        //             </div>)
        //     }
        // </>
    );
}

const DleteChat = ({closeDialog, chatInfo, title, setMsgSend, msgSend, setChat} : DialogProps) => {

    const handleOnClickYes = () => {
        if (!chatInfo)
            return;
        Axios.post("http://localhost:3000/chat/friend/delet-chat",
            {channelId: chatInfo.chatId},
            {withCredentials: true})
            .then(() => {
                if (setMsgSend)
                    setMsgSend(!msgSend);
                if (closeDialog)
                    closeDialog();
                if (setChat)
                    setChat('', '', '', '', null);
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

const ClearChat = ({closeDialog, chatInfo, title} : DialogProps) => {

    const handleOnClickYes = () => {
        if (!chatInfo)
            return;
        Axios.post("http://localhost:3000/chat/setting/clear-chat",
            {channelid: chatInfo.chatId},
            {withCredentials: true})
            .then(() => {
            })
            .catch((error) => {
                console.log(error);
                if (closeDialog)
                    closeDialog();
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

const DeleteGroup = ({closeDialog, chatInfo, setChat, closeGroupSetting} : DialogProps) => {

    const handleOnClickYes = () => {
        if (!chatInfo)
            return;
        Axios.post("http://localhost:3000/chat/setting/delet-group",
            {channelid: chatInfo.chatId},
            {withCredentials: true})
            .then(() => {
                if (setChat)
                    setChat('', '', '', '', null);
                if (closeDialog)
                    closeDialog();
                if (closeGroupSetting)
                    closeGroupSetting();
            })
            .catch((error) => {
                console.log(error);
                if (closeDialog)
                    closeDialog();
            })
    }

    return (
        <div className='dialog-remove-group'>
            <FontAwesomeIcon icon={faTriangleExclamation} size='3x' style={{color: "#000000",}} />
            <p className='dialog-remove-group-msg'>Are you sure you want to delete {'GROUPNAME'} group ?</p>
            <div className='dialog-remove-group-cancel-yes'>
                <button onClick={closeDialog}>Cancel</button>
                <button className='dialog-remove-group-yes-btn' onClick={handleOnClickYes}>Yes</button>
            </div>
        </div>
    );
}

const BlockUser = ({closeDialog, chatInfo, setMsgSend,
                    msgSend, setChat} : DialogProps) => {

    const handleOnClick = () => {
        if (!chatInfo)
            return;
        Axios.patch("http://localhost:3000/chat/friend/block_friend",
            {FriendId: chatInfo.chatUserId},
            {withCredentials: true})
            .then((response) => {
                if (setMsgSend)
                    setMsgSend(!msgSend);
                if (closeDialog)
                    closeDialog();
                console.log('response.status: ', response.status, 'setChat: ', setChat)
                if (response.status === 200 && setChat)
                {
                    console.log('here')
                    setChat(chatInfo.chatId, chatInfo.chatImage,
                            chatInfo.chatName, chatInfo.chatType,
                            chatInfo.chatUserId, true,
                            chatInfo.chatUserId);

                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div className='dialog-remove-group'>
            <FontAwesomeIcon icon={faTriangleExclamation} size='3x' style={{color: "#000000",}} />
            <p className='dialog-remove-group-msg'>Are you sure you want to block {chatInfo?.chatName} ?</p>
            <div className='dialog-remove-group-cancel-yes'>
                <button onClick={closeDialog}>Cancel</button>
                <button className='dialog-remove-group-yes-btn'
                        onClick={handleOnClick}>Yes</button>
            </div>
        </div>
    );
}

const UnBlock = ({closeDialog, chatInfo, setMsgSend, msgSend} : DialogProps) => {

    const handleOnClick = () => {
        if (chatInfo === undefined
                || !chatInfo.blocked)
            return;
        Axios.patch("http://localhost:3000/chat/friend/block_friend",
            {FriendId: chatInfo.chatUserId},
            {withCredentials: true})
            .then((response) => {
                if (setMsgSend)
                    setMsgSend(!msgSend);
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
            <p className='dialog-remove-group-msg'>Are you sure you want to unblock {chatInfo?.chatName} ?</p>
            <div className='dialog-remove-group-cancel-yes'>
                <button onClick={closeDialog}>Cancel</button>
                <button className='dialog-remove-group-yes-btn'
                        onClick={handleOnClick}>Yes</button>
            </div>
        </div>
    )
}

type DialogProps =
{
    title?:             string;
    closeDialog?:       () => void;
    setChat?:           (chatId: string, chatImage: string,
                            chatName: string, chatType: string, userId: number | null,
                            blocked?: boolean, whoblock?: number | null) => void,
    chatInfo?:          chatInfoType,
    msgSend?:           boolean,
    setMsgSend?:        (msgSend: boolean) => void,
    setUpdate?:         (update: boolean) => void,
    update?:            boolean,
    membersData?:       membersDataType | null,
    membersWarn?:       boolean,
    setMembersWarn?:    (membersWarn: boolean) => void,
    setUpdatedAdmins?:  (updateAdmins: boolean) => void,
    closeGroupSetting?: () => void,
    setUpdateChatInfo?: (update: boolean) => void,
}

export function Dialog({title, closeDialog, setChat,
                        chatInfo, msgSend, setMsgSend,
                        setUpdate, update, membersData,
                        membersWarn, setMembersWarn, setUpdatedAdmins,
                        closeGroupSetting, setUpdateChatInfo} : DialogProps)
{
    let ItemComponent :React.ComponentType = () => <p>Invalid Choose</p>;

    switch(title)
    {
        case 'New Chat':
            ItemComponent = () => <NewChat setChat={setChat} closeDialog={closeDialog} />;
            break;
        
        case 'Create Group':
            ItemComponent = () =>  <CreateGroup setChat={setChat} closeDialog={closeDialog} />;
            break;

        case 'add member':
            ItemComponent = () => <CreateGroupSecondDialog  type="add member"
                                                            chatInfo={chatInfo}
                                                            closeDialog={closeDialog}
                                                            setUpdate={setUpdate}
                                                            update={update}
                                                            membersWarn={membersWarn}
                                                            setMembersWarn={setMembersWarn}/>;
            break;

        case 'Leave Group':
            ItemComponent = () => <LeaveGroup   chatInfo={chatInfo}
                                                closeDialog={closeDialog}
                                                setChat={setChat}/>;
            break;
        
        case 'Remove Member':
            ItemComponent = () => <RemoveMember chatInfo={chatInfo}
                                                closeDialog={closeDialog}
                                                setUpdate={setUpdate}
                                                update={update} />;
            break;
        
        // case 'Mute Member':
        //     ItemComponent = dialogContent.muteMember;
        //     break;
        
        case 'Add admin':
            ItemComponent = () => <AddAdmin membersData={membersData}
                                            closeDialog={closeDialog}
                                            chatInfo={chatInfo}
                                            setUpdatedAdmins={setUpdatedAdmins}/>;
            break;

        case 'Delete':
            ItemComponent = () => <DleteChat    chatInfo={chatInfo}
                                                closeDialog={closeDialog}
                                                title={title}
                                                setMsgSend={setMsgSend}
                                                msgSend={msgSend}
                                                setChat={setChat}/>;
            break;
        
        case 'Block':
            ItemComponent = () => <BlockUser    closeDialog={closeDialog}
                                                chatInfo={chatInfo}
                                                setMsgSend={setMsgSend}
                                                msgSend={msgSend}
                                                setUpdateChatInfo={setUpdateChatInfo}
                                                setChat={setChat}/>
            break;

        case 'Delete Group':
            ItemComponent = () => <DeleteGroup  closeDialog={closeDialog}
                                                chatInfo={chatInfo}
                                                setChat={setChat}
                                                closeGroupSetting={closeGroupSetting}/>;
            break;
        case 'Clear chat':
            ItemComponent = () => <ClearChat    closeDialog={closeDialog}
                                                chatInfo={chatInfo}/>
            break;
        
        case 'Unblock':
                ItemComponent = () => <UnBlock  closeDialog={closeDialog}
                                                chatInfo={chatInfo}/>
            break;
        
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
