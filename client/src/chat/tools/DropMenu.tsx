import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretUp, faEllipsisVertical} from '@fortawesome/free-solid-svg-icons' ;
import { Dialog } from "./Dialog";
import './dropMenu.css'

type DropMenuProps =
{
  list:               string[];
  OnOpen?:            (open: boolean) => void,
  defaultValue?:      boolean,
  settings?:          boolean,
  size?:              string,
  triggerIconSize?:   string,
  setIsProfileOpen?:  (isOpen: boolean) => void,
  setChat?: (chatId: string, chatImage: string, chatName: string, chatType: string) => void
}

const DropMenu = ({list, defaultValue = true, OnOpen, settings = false, 
                  size='14px', triggerIconSize='9px', setIsProfileOpen,
                  setChat} : DropMenuProps) => {

    const [selectedDropMenu, setSelectedDropMenu] = useState(list[0]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [Item, setItem] = useState('');

    const items = list.map(item => {
      return (
            <Dropdown.Item
              className="DropMenu-item"
              key={item}
              onSelect={() => handleDropMenuChange(item)} >
                {item}
            </Dropdown.Item>
      );
    });

    const handleDropMenuChange = (value: string) => {
      if (!settings)
        setSelectedDropMenu(value);
      
        if (settings)
        {
          setIsDialogOpen(true);
          setItem(value);
        }

        if (value === 'Profile')
          setIsProfileOpen && setIsProfileOpen(true);
      // Apply filtering logic based on the selected filter
      // For example, update the state or trigger a filtering function
    };

    const closeDialog = () => {
      setIsDialogOpen(false);
    }

    return (
      <>
        <Dropdown.Root onOpenChange={OnOpen}>
          <Dropdown.Trigger className="DropMenuTrigger">
            {
              defaultValue ?
                <div className="DropMenuTrigger-items">
                  <div>
                    {selectedDropMenu}
                  </div>
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    rotation={180}
                    style={{color: "#000000", fontSize:`${triggerIconSize}`}}
                    className="caret"/>
                </div>
              : 
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  style={{color: "#000000", fontSize:`${size}`}}/>
            }
          </Dropdown.Trigger>
          <Dropdown.Content className="DropMenu-content">
              <Dropdown.Group>
                  {items}
              </Dropdown.Group>
          </Dropdown.Content>
        </Dropdown.Root>
        {
          isDialogOpen && <Dialog title={Item} closeDialog={closeDialog} setChat={setChat} />
        }
      </>
    );
  };
  
  export default DropMenu;