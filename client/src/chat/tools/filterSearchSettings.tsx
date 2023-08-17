import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons' ;
import DropMenu from './DropMenu';
import { chatInfoType } from "../chat";

type searchProps = {
    searchQuery:    string,
    setSearchQuery: (searchQuery: string) => void,
}

export function Search({searchQuery, setSearchQuery}: searchProps)
{
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    return(
        <div className="search">
            <input  className="search-input"
                    name="search-input"
                    value={searchQuery}
                    type="search"
                    placeholder="Search..."
                    onChange={handleInputChange}/>
            <FontAwesomeIcon
                className="search-icon"
                icon={faMagnifyingGlass}
                size="2xs"
                style={{color: "#000000",}}
            />
        </div>
    );
}

type FilterBtnProps = {
    list:       string[];
    setFilter?:  (filter: string) => void,
}

export function FilterBtn({list, setFilter} : FilterBtnProps)
{
    const [hasShadow, setHasShadow] = useState(true);

    const handleMenuOpenChange = (open: Boolean) => {
        setHasShadow(!open);
    };

    return (
        <div className={`filter  ${hasShadow ? '': 'triger-without-shadow'}`}>
            <DropMenu   list={list} 
                        OnOpen={handleMenuOpenChange}
                        setFilter={setFilter} />
        </div>
    );
}

type SettingsProps =
{
    list:                   string[];
    size?:                  string,
    setIsProfileOpen?:      (isOpen: boolean) => void
    setChat?:               (chatId: string, chatImage: string,
                                chatName: string, chatType: string, userId: number | null,
                                blocked?: boolean, whoblock?: number | null) => void,
    chatInfo?:              chatInfoType,
    msgSend?:               boolean,
    setMsgSend?:            (msgSend: boolean) => void,
    setUpdateChatInfo?:     (update: boolean) => void,
    joinRoom?:              (channelId: string) => void,
    setUpdateGroup?:        (update: boolean) => void,
    updateGroup?:           boolean,
    leaveRoom?:             () => void,
}

export function Settings({list, size='14px', setIsProfileOpen,
                            setChat, chatInfo, msgSend, setMsgSend,
                            setUpdateChatInfo, joinRoom, setUpdateGroup,
                            updateGroup, leaveRoom} : SettingsProps)
{
    return (
        <div className="chat-settings">
            <DropMenu   setIsProfileOpen={setIsProfileOpen}
                        list={list} 
                        defaultValue={false}
                        settings={true}
                        size={size}
                        setChat={setChat}
                        chatInfo={chatInfo}
                        msgSend={msgSend}
                        setMsgSend={setMsgSend}
                        setUpdateChatInfo={setUpdateChatInfo}
                        joinRoom={joinRoom}
                        updateGroup={updateGroup}
                        setUpdateGroup={setUpdateGroup}
                        leaveRoom={leaveRoom}/>
        </div>
    );
}