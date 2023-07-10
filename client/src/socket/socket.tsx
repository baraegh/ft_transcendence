import { io, Socket } from "socket.io-client";

export let socketInstance: Socket | null = null;

export const initializeSocket = () => {
  socketInstance = io("http://localhost:3000");
};

export const getSocket = () => {
  if (!socketInstance) {
    throw new Error("Socket not initialized. Call initializeSocket() first.");
  }
  return socketInstance;
};

export const maketest = (id: number) =>{
  if(socketInstance){
    console.log("active: "+socketInstance);
    let data = {
      userId : id,
    }
    socketInstance.emit("connect01", data);
  }

}