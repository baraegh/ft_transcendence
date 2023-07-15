import React, { useState, useEffect, useContext } from "react";
import ChatHistoryList from "./chatHistory/chatHistoryList";
import { FriendList } from "./chatFriendList/friendList";
import { ChatArea, ChatAreaProfile, ChatAreaGroup, ChatGroupSettings} from "./ChatArea/charArea";
import "./chat.css";
import Axios from "axios";

import Image from "./barae.jpg";
import { useNavigate } from "react-router-dom";
import MyHeader from "../front-end/tsx/header";
import { SocketContext } from "../socket/socketContext";
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
  mute:       string,
}

const updateChatInfoCntext = React.createContext<boolean>(false);

export const formatDate = (sentTime: string): string => {

  const currentTime = new Date();
  const sentTimestamp = new Date(sentTime).getTime();
  const currentTimestamp = currentTime.getTime();
  const timeDifferenceInMilliseconds = currentTimestamp - sentTimestamp;
  const millisecondsPerMinute = 1000 * 60;
  const millisecondsPerHour = millisecondsPerMinute * 60;
  const millisecondsPerDay = millisecondsPerHour * 24;

  let timePassedText = "";

  if (timeDifferenceInMilliseconds < millisecondsPerMinute)
    timePassedText = "Just now";
  else if (timeDifferenceInMilliseconds < millisecondsPerHour)
  {
    const minutesPassed = Math.floor(timeDifferenceInMilliseconds / millisecondsPerMinute);
    timePassedText = `${minutesPassed} minute${minutesPassed !== 1 ? 's' : ''} ago`;
  }
  else if (timeDifferenceInMilliseconds < millisecondsPerDay)
  {
    const hoursPassed = Math.floor(timeDifferenceInMilliseconds / millisecondsPerHour);
    timePassedText = `${hoursPassed} hour${hoursPassed !== 1 ? 's' : ''} ago`;
  }
  else if (timeDifferenceInMilliseconds < millisecondsPerDay * 10)
  {
    const daysPassed = Math.floor(timeDifferenceInMilliseconds / millisecondsPerDay);
    timePassedText = `${daysPassed} day${daysPassed !== 1 ? 's' : ''} ago`;
  }
  else
  {
    const formattedDate = currentTime.toISOString().split('T')[0]; // Format the current date as "yyyy-mm-dd"
    timePassedText = formattedDate.replace(/-/g, '/'); // Replace "-" with "/" to get "yyyy/mm/dd" format
  }

  return timePassedText;
}

export function Chat() {

  const [chatInfo, setChatInfo] = useState<chatInfoType>({
    chatId:     '',
    chatType:   '',
    chatImage:  '',
    chatName:   '',
    chatUserId: null,
    blocked:    false,
    whoblock:   null,
    mute:       'NAN',
  });
  const [membersData, setMembersData] = useState<membersDataType>(
    {
      owner: { id: 0, username: "", image: "" },
      admins: [],
      users: [],
    }
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatSettingOpen, setIsChatSettingOpen] = useState(false);
  const [role, setRole] = useState('user');
  const [updateGroup, setUpdateGroup] = useState(false);
  const [updateChatInfo, setUpdateChatInfo] = useState(false);
  const [updateUserCard, setUpdateUserCard] = useState(false);
  const {socket} = useContext<any | undefined>(SocketContext);

  const setChat = (Id: string, Image: string, Name: string,
                    Type: string, userId: number | null,
                    blocked?: boolean, whoblock?: number | null, muted?: string) => {

    setChatInfo({chatId: Id, chatImage: Image,
                chatName: Name, chatType: Type,
                chatUserId: userId,
                blocked: blocked? blocked: false, 
                whoblock: whoblock? whoblock: null,
                mute: muted? muted: 'NAN',
              })
  }

  const leaveRoom = () => {

    if (socket)
        socket.emit('leaveRoom', chatInfo.chatId);
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
                              updateChatInfo={updateChatInfo}
                              updateUserCard={updateUserCard}
                              leaveRoom={leaveRoom}/>

            <div className="chat-area">
              {chatInfo.chatId !== '' ? (
                <ChatArea
                  chatInfo={chatInfo} 
                  setIsProfileOpen={setIsProfileOpen}
                  setUpdateChatInfo={setUpdateChatInfo}
                  setChat={setChat}
                  setUpdateUserCard={setUpdateUserCard}
                  updateUserCard={updateUserCard}
                  updateChatInfo={updateChatInfo}
                  leaveRoom={leaveRoom}/>
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
              <FriendList setChat={setChat}
                          chatInfo={chatInfo}
                          update={updateGroup}
                          setUpdate={setUpdateGroup}/>
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
    </div>
  );
}

export default Chat;

