import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons' ;
import DropMenu from './DropMenu';

export function Search()
{
    return(
        <div className="search">
            <input className="search-input" type="search" placeholder="Search..." />
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
    list: string[];
}

export function FilterBtn({list} : FilterBtnProps)
{
    const [hasShadow, setHasShadow] = useState(true);

    const handleMenuOpenChange = (open: Boolean) => {
        setHasShadow(!open);
    };

    return (
        <div className={`filter  ${hasShadow ? '': 'triger-without-shadow'}`}>
            <DropMenu list={list} OnOpen={handleMenuOpenChange} />
        </div>
    );
}

type SettingsProps =
{
    list: string[];
    size?: string,
    setIsProfileOpen?:  (isOpen: boolean) => void
    setChat?: (chatId: string, chatImage: string, chatName: string, chatType: string) => void
}

export function Settings({list, size='14px', setIsProfileOpen, setChat} : SettingsProps)
{
    return (
        <div className="chat-settings">
            <DropMenu setIsProfileOpen={setIsProfileOpen} list={list} 
                defaultValue={false} settings={true} size={size}
                setChat={setChat}/>
        </div>
    );
}