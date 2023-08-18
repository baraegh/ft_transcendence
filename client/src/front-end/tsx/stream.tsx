import React, { useContext, useEffect, useState } from 'react';
import MyHeader from './header';
import { SocketContext } from '../../socket/socketContext';
import axios from 'axios';
import '../css/stream.css'
import { useNavigate } from 'react-router-dom';
import { userMe } from '../../App';



type Tstreaming = {
  roomName: string;
  client1Id: string;
  client2Id: string;
  player1Id: number;
  player2Id: number;
};

interface User {
  id: number;
  username: string;
  image: string;
  gameWon: number;
  gameLost: number;
  achievements: string[];
}

function Stream(): JSX.Element {
  const { socket } = useContext<any | undefined>(SocketContext);
  const [fStreaming, setFStreaming] = useState<Map<string, Tstreaming> | null>(null);
  const [userData1, setUserData1] = useState<User | null>(null);
  const [userData2, setUserData2] = useState<User | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    socket?.emit('exploreRooms', 'hello'); // sending socket to server

    const handleSocket = (streaming: Tstreaming) => {
      setFStreaming((prevMap) => {
        if (prevMap === null) {
          // If the previous map is null, create a new map with the current streaming data
          return new Map([[streaming.roomName, streaming]]);
        } else {
          // If the previous map exists, update it with the new streaming data
          const newMap = new Map(prevMap);
          newMap.set(streaming.roomName, streaming);
          return newMap;
        }
      });
    };

    socket?.on('allRoomsData', handleSocket);

    return () => {
      socket?.off('allRoomsData', handleSocket);
    };
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    if (fStreaming !== null) {
      const streamingArray = Array.from(fStreaming);
      streamingArray.forEach(([key, value]) => {
        fetchData(value.player1Id, value.player2Id);
      });
    }
  }, [fStreaming]);

  const fetchData = (playerid1: number, playerid2: number) => {
    const fetchUserData1 = axios.get(`${import.meta.env.VITE_BACKEND_URL}/other-profile/about/${playerid1}`, { withCredentials: true });
    const fetchUserData2 = axios.get(`${import.meta.env.VITE_BACKEND_URL}/other-profile/about/${playerid2}`, { withCredentials: true });

    Promise.all([fetchUserData1, fetchUserData2])
      .then((responses) => {
        const userDataResponse = responses[0];
        const additionalDataResponse = responses[1];

        if (userDataResponse.status === 200 && additionalDataResponse.status === 200) {
          const userData = userDataResponse.data;
          const user2Data = additionalDataResponse.data;

          const fetchedUser1: User = {
            id: userData.id,
            username: userData.username,
            image: userData.image,
            gameWon: userData.gameWon,
            gameLost: userData.gameLost,
            achievements: userData.achievements,
          };
          const fetchedUser2: User = {
            id: user2Data.id,
            username: user2Data.username,
            image: user2Data.image,
            gameWon: user2Data.gameWon,
            gameLost: user2Data.gameLost,
            achievements: user2Data.achievements,
          };

          setUserData1(fetchedUser1);
          setUserData2(fetchedUser2);
        } else {
          throw new Error('Request failed');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log('fStreaming: ', fStreaming);
  console.log('userData1: ', userData1?.username);
  console.log('userData1: ', userData1?.image);
  console.log('userData2: ', userData2?.username);
  console.log('userData2: ', userData2?.image);

  let renderedItems: JSX.Element[] = [];
  if (fStreaming !== null) {
    const streamingArray = Array.from(fStreaming);
    renderedItems = streamingArray.map(([key, value]) => {
      const user1 = userData1 && userData1.id === value.player1Id ? userData1 : null;
      const user2 = userData2 && userData2.id === value.player2Id ? userData2 : null;
  
      return (
        <div className='stream-container' key={key} onClick={() => {
          navigate("/gamePlay")
          socket.emit('joinStreamRoom', value.roomName)
        }}>
          {user1 && (
            <div className='stream-user-container'>
              <p id="stream-user-username" >{user1.username}</p>
              <img id="stream-user-image" src={user1.image} alt={user1.username} />
            </div>
          )}
  
          {user2 && (
            <div className='stream-user-container'>
              <p id="stream-user-username" >{user2.username}</p>
              <img id="stream-user-image" src={user2.image} alt={user2.username} />
            </div>
          )}
        </div>
      );
    });
  }

  return (
    <div>
      <MyHeader />
      <div className='mainDisplay'>

        {renderedItems}
        
        </div>
    </div>
  );
}

export default Stream;
