import React, { useState, useEffect } from "react";
import ChatHistoryList from "./chatHistory/chatHistoryList";
import { FriendList } from "./chatFriendList/friendList";
import { ChatArea, ChatAreaProfile, ChatAreaGroup, ChatGroupSettings} from "./ChatArea/charArea";
import "./chat.css";
import MyHeader from "../front-end/tsx/header";
export {updateChatInfoCntext};

export type membersDataType = {
  owner : {id: number, username: string, image: string };
  admins: {id: number, username: string, image: string }[];
  users: {id: number, username: string, image: string }[];
}

export type chatInfoType = {
  chatId:     string,
  chatType:   string,
  chatImage:  string,
  chatName:   string,
  chatUserId: number | null,
  blocked:    boolean,
  whoblock:   number | null,
}

const updateChatInfoCntext = React.createContext<boolean>(false);

export function Chat() {

  const [chatInfo, setChatInfo] = useState<chatInfoType>({
    chatId:     '',
    chatType:   '',
    chatImage:  '',
    chatName:   '',
    chatUserId: null,
    blocked:    false,
    whoblock:   null,
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatSettingOpen, setIsChatSettingOpen] = useState(false);
  const [membersData, setMembersData] = useState<membersDataType>(
    {
      owner: { id: 0, username: "", image: "" },
      admins: [],
      users: [],
    }
  );
  const [role, setRole] = useState('user');
  const [updateGroup, setUpdateGroup] = useState(false);
  const [updateChatInfo, setUpdateChatInfo] = useState(false);

  const setChat = (Id: string, Image: string, Name: string,
                    Type: string, userId: number | null,
                    blocked?: boolean, whoblock?: number | null) => {

    setChatInfo({chatId: Id, chatImage: Image,
                chatName: Name, chatType: Type,
                chatUserId: userId,
                blocked: blocked? blocked: false, 
                whoblock:whoblock? whoblock: null,
              })
  }

  return (
    <updateChatInfoCntext.Provider value={updateChatInfo}>
      <MyHeader />
      <div className="chat-page">
        {!isChatSettingOpen ? (
          <>
            <ChatHistoryList  chatInfo={chatInfo}
                              setChat={setChat}
                              setIsProfileOpen={setIsProfileOpen}
                              setRole={setRole}
                              updateGroup={updateGroup}
                              setUpdateGroup={setUpdateGroup}
                              updateChatInfo={updateChatInfo}/>

            <div className="chat-area">
              {chatInfo.chatId !== '' ? (
                <ChatArea
                  chatInfo={chatInfo} 
                  setIsProfileOpen={setIsProfileOpen}
                  setUpdateChatInfo={setUpdateChatInfo}
                  setChat={setChat}/>
              ) : (
                <div className="chat-area-default">
                  <p>Getting no message is also a message</p>
                </div>
              )}
            </div>

            {chatInfo.chatId !== null && chatInfo.chatType !== '' && chatInfo.chatType !== "PERSONEL" ? (
              <ChatAreaGroup  chatInfo={chatInfo} 
                              setIsChatSettingOpen={setIsChatSettingOpen}
                              membersData={membersData}
                              setMembersData={setMembersData}
                              role={role}
                              setChat={setChat}
                              update={updateGroup}
                              setUpdate={setUpdateGroup}/>
            ) : isProfileOpen ? (
              <ChatAreaProfile  chatInfo={chatInfo}
                                setIsProfileOpen={setIsProfileOpen} />
            ) : (
              <FriendList />
            )}
          </>
        ) : (
          <ChatGroupSettings  setIsChatSettingOpen={setIsChatSettingOpen}
                              membersData={membersData}
                              setMembersData={setMembersData}
                              chatInfo={chatInfo}
                              setChatInfo={setChatInfo}
                              role={role}
                              setChat={setChat}/>
        )}
      </div>
    </updateChatInfoCntext.Provider>
  );
}

export default Chat;

