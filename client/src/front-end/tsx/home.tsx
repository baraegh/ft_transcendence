import { useContext, useEffect, useState } from "react";
import "../css/home.css";
import MyHeader from "./header";
import { useNavigate } from "react-router-dom";
import Game from "../../game/example";
import axios from "axios";
import { getSocket, initializeSocket, socketInstance } from "../../socket/socket";
import { Socket } from "socket.io-client";
import { SocketContext } from "../../socket/socketContext";
function Home(): JSX.Element {
  const [isHeaderLoaded, setIsHeaderLoaded] = useState(false);
  const { socket } = useContext<any | undefined>(SocketContext);

  useEffect(() => {
    // Use the socket instance here
    if (socket) {
      {
        console.log("CREATED AT Home >> ");
      }
    }
  }, [socket]);
  useEffect(() => {
    // Simulating a delay for the header to load
    setTimeout(() => {
      setIsHeaderLoaded(true);
    }, 10000); // Adjust the delay time as needed
  }, [])


  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/me", {
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log(response.data.id);
          const cdata = { userId: response.data.id};
          socket.emit('connect01',cdata);
          console.log("connect01");
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {
    if(socket )
  {

    socket.on("chatToClient", (msg) => {
      console.log(msg);
    });
    socket.on("FriendRequestResponse", (data: any) => {
      console.log("Received data from server:", data);
      // Perform actions with the received data
    });

    // socket.on("chatToClient", (msg: any) => {
    //   console.log("msg");
    // });
  }

    
  }, []);
  // if(socket )
  // {

  //   socket.on("chatToClient", (msg) => {
  //     console.log(msg);
  //   });
  //   socket.on("FriendRequestResponse", (data: any) => {
  //     console.log("Received data from server:", data);
  //     // Perform actions with the received data
  //   });

  //   // socket.on("chatToClient", (msg: any) => {
  //   //   console.log("msg");
  //   // });
  // }
  const leaveroom = () =>{

    if (socket) {
      socket.emit('leaveRoom', '1');
      console.log("leaved");
      }
    }
    const sendingroup = () =>{
  
    if (socket) {
      socket.emit('chatToServer', { sender: "this.username", room: "1", message: "this.text" });
      console.log("send");
      }
    }
    const joiroom = () =>{
      if (socket) {
        socket.emit('joinRoom', "1");
        console.log("join");
      }
    }

  return (
    <div>
         <MyHeader />
         <Game />
      <div className="P_W">
        <a id="Play" href="#">
          <span>Play</span>
        </a>
        <a id="WatchStream" href="#">
          <span>Watch Stram</span>
        </a>
        <button
        onClick={ joiroom}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        joiroom
      </button>

      <button
        onClick={ leaveroom}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        leaverrom
      </button>

      <button
        onClick={ sendingroup}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        sendingroup
      </button>
      </div>
    </div>
  );
}

export default Home;
