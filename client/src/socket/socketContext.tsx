import React, { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
  reconnectSocket: () => void;
}

export const SocketContext = createContext<SocketContextProps | undefined>(
  undefined
);

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = () => {
    const newSocket: Socket = io('http://localhost:3000');
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  const reconnectSocket = () => {
    disconnectSocket();
    connectSocket();
  };

  return (
    <SocketContext.Provider value={{ socket, reconnectSocket }}>
      {socket && children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
