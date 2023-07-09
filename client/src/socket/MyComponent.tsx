import axios from "axios";
import { useEffect, useState } from "react";
import { initializeSocket, getSocket } from "./socket";

const MyComponent = () => {
  const [getid, setid] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/me", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setid(response.data.id);
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (getid !== null) {
        console.log(getid);
        initializeSocket(getid);
      }
    const socket = getSocket();

    if (socket) {
      socket.on("connect", () => {
        const requestData = {
          event: "userConnected",
          user: { id: getid },
        };
        socket.emit("requestData", requestData);
      });

      socket.on("gameRequestResponse", (data) => {
        console.log("Received data from server:", data);
        // Perform actions with the received data
      });

      socket.on("FriendRequestResponse", (data) => {
        console.log("Received data from server:", data);
        // Perform actions with the received data
      });

      socket.on("chatToClient", (msg) => {
        console.log(msg);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [getid]);

  return null;
};

export default MyComponent;