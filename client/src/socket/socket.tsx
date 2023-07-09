import { io, Socket } from "socket.io-client";

export let socketInstance: Socket | null = null;

export const initializeSocket = (userId: number) => {

  socketInstance = io("http://localhost:3000", {
    query: { user: encodeURIComponent(JSON.stringify({ id: userId })) },
  });
};

export const getSocket = () => {
  if (!socketInstance) {
    throw new Error("Socket not initialized. Call initializeSocket() first.");
  }
  return socketInstance;
};