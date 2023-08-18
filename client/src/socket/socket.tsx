import { io, Socket } from "socket.io-client";

export let socketInstance: Socket | null = null;

export const initializeSocket = () => {
  socketInstance = io("http://0.0.0.07:3000");
};

export const getSocket = () => {
  if (!socketInstance) {
    throw new Error("Socket not initialized. Call initializeSocket() first.");
  }
  return socketInstance;
};