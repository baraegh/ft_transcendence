import React, { createContext, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
});

interface SocketContextProviderProps {
  children: React.ReactNode;
}

const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
  const socket = io('http://localhost:3000');
  let data = {
    playerid : 123,
  }
  socket.emit("connect01" ,data);
  useEffect(() => {
    return () => {
      // Clean up the socket connection on unmount
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketContextProvider };