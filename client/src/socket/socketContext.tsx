import React, { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextProps | undefined>(
  undefined
);

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket: Socket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {socket && children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
