import React, { useState, useEffect } from "react";
import ChatHistoryList from "./chatHistory/chatHistoryList";
import { FriendList } from "./chatFriendList/friendList";
import { ChatArea, ChatAreaProfile, ChatAreaGroup, ChatGroupSettings} from "./ChatArea/charArea";
import "./chat.css";
import Axios from "axios";

import Image from "./barae.jpg";
import { useNavigate } from "react-router-dom";

type msgListType = {
  id: number;
  sender: string;
  msg: string;
  time: string;
  image?: string;
}[];

const arrayOfMsg00: msgListType = [
  { id: 0, sender: "barae", msg: "test 2 ", time: "time", image: Image },
  { id: 1, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  {
    id: 2,
    sender: "barae",
    msg: "test 2 test 2 test 2 test 2test 2 test 2test 2 test 2test 2 test 2test 2 test 2test 2 test 2test 2 test 2test 2 test 2 test 2 test 2test 2 test 2test 2 test 2test 2 test 2test 2 test 2test 2 test 2test 2 test 2test 2 test 2 test 2 test 2test 2 test 2test 2 test 2test 2 test 2testtesttesttest 2 test 2test 2 test 2test 2 test 2t 2test 2 test 2test 2 test 2 test 2 test 2test 2 test 2test 2 test 2test 2 test 2testtesttesttest 2 test 2test 2 test 2test 2 test 2t 2test 2 test 2test 2 test 2 test 2 test 2test 2 test 2test 2 test 2test 2 test 2testtesttesttest 2 test 2test 2 test 2test 2 test 2t 2test 2 test 2test 2 test 2 test 2 test 2test 2 test 2test 2 test 2test 2 test 2testtesttesttest 2 test 2test 2 test 2test 2 test 2t 2test 2 test 2test 2 test 2 test 2 test 2test 2 test 2test 2 test 2test 2 test 2testtesttesttest 2 test 2test 2 test 2test 2 test 2t 2test 2 test 2test 2 test 2 test 2 test 2test 2 test 2test 2 test 2test 2 test 2testtesttesttest 2 test 2test 2 test 2test 2 test 2",
    time: "time",
    image: Image,
  },
  { id: 3, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 4, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 5, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 6, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 7, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 8, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 9, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 10, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 11, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 12, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 13, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 14, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 15, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 16, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 17, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 18, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 19, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 20, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 21, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 22, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 23, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 24, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 25, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 26, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 27, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 28, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 29, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 30, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 31, sender: "me", msg: ".", time: "time" },
  { id: 32, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 33, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 34, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 35, sender: "me", msg: "test 1testtest 1test 1", time: "time" },
  { id: 36, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 37, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 38, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 39, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 40, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 41, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 42, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 43, sender: "me", msg: "test 1test  1test 1", time: "time" },
  { id: 44, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 45, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 46, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 47, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 48, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 49, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 50, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 51, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
  { id: 52, sender: "barae", msg: "test 2", time: "time", image: Image },
  { id: 53, sender: "me", msg: "test 1test 1test 1test 1test 1", time: "time" },
];

type chatArrayType = { chatId: number; chat: msgListType; type: string }[];

/* SCRIPT TO GENERATE RANDOM DATA */
type msgType = {
  id: number;
  sender: string;
  msg: string;
  time: string;
  image?: string;
};

const generateRandomMessage = (id: number): msgType => {
  const senders = ["barae", "me"]; // Possible sender values
  const messageLengths = [10, 200, 300]; // Possible message lengths

  const randomSender = senders[Math.floor(Math.random() * senders.length)];
  const randomLength =
    messageLengths[Math.floor(Math.random() * messageLengths.length)];

  const randomText = generateRandomText(randomLength); // Generate random text or paragraphs

  const message: msgType = {
    id,
    sender: randomSender,
    msg: randomText,
    time: "time",
    image: Image,
  };

  return message;
};

const generateRandomText = (length: number): string => {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomText = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomText += characters.charAt(randomIndex);
  }

  return randomText;
};

const generateArrayOfMsg = (count: number): msgType[] => {
  const arrayOfMsg: msgType[] = [];

  for (let i = 0; i < count; i++) {
    const message = generateRandomMessage(i);
    arrayOfMsg.push(message);
  }

  return arrayOfMsg;
};
generateArrayOfMsg(100);
/* END OF SCRIPT */

const chatArray: chatArrayType = [
  { chatId: 0, chat: generateArrayOfMsg(10), type: "group" },
  { chatId: 1, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 2, chat: generateArrayOfMsg(20), type: "normal" },
  { chatId: 3, chat: generateArrayOfMsg(30), type: "normal" },
  { chatId: 4, chat: generateArrayOfMsg(4), type: "normal" },
  { chatId: 5, chat: generateArrayOfMsg(2), type: "normal" },
  { chatId: 6, chat: generateArrayOfMsg(144), type: "normal" },
  { chatId: 7, chat: generateArrayOfMsg(23), type: "normal" },
  { chatId: 8, chat: generateArrayOfMsg(10), type: "normal" },
  { chatId: 9, chat: generateArrayOfMsg(10), type: "normal" },
  { chatId: 10, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 11, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 12, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 13, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 14, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 15, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 16, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 17, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 18, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 19, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 20, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 21, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 22, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 23, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 24, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 25, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 26, chat: generateArrayOfMsg(100), type: "normal" },
  { chatId: 27, chat: generateArrayOfMsg(100), type: "normal" },
];

export function Chat() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatType, setChatType] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatSettingOpen, setIsChatSettingOpen] = useState(false);

  const navigate = useNavigate();
  const fetchdata = () => {
    Axios
      .post("http://localhost:3000/auth/refresh",null, { withCredentials: true })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Request failed");
        }
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      });
  };
  fetchdata();

  useEffect(() => {
    console.log(`chatId: ${chatId}`);
    if (!chatId)
      return ;
    Axios.get("http://localhost:3000/chat/all-msg/", {withCredentials: true, channelId: chatId})
        .then((response) => {
            console.log('here');
            console.log(response.data);
          }
        )
        .catch((error) => {
            console.log(error);
          }
        );
  },[chatId]);


  return (
    <div className="chat-page">
      {!isChatSettingOpen ? (
        <>
          <ChatHistoryList
            setChatId={setChatId}
            setChatType={setChatType}
            setIsProfileOpen={setIsProfileOpen}
          />
          <div className="chat-area">
            {chatId !== null ? (
              // <ChatArea
              //   chatId={chatId}
              //   setIsProfileOpen={setIsProfileOpen}
              //   // type={chatType? chatType: 'PERSONEL'}
              // />
              <p>chatArea</p>
            ) : (
              <div className="chat-area-default">
                <p>Getting no message is also a message</p>
              </div>
            )}
          </div>

          {/* {chatId !== null && chatType === "group" ? (
            <ChatAreaGroup setIsChatSettingOpen={setIsChatSettingOpen} />
          ) : isProfileOpen ? (
            <ChatAreaProfile setIsProfileOpen={setIsProfileOpen} />
          ) : ( */}
            <FriendList />
          {/* )} */}
        </>
      ) : (
        <ChatGroupSettings setIsChatSettingOpen={setIsChatSettingOpen} />
      )}
    </div>
  );
}

export default Chat;

