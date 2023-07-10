import { useContext, useEffect, useRef } from "react";
import { socketInstance } from "/Users/rimney/Desktop/ft_transcendence/client/src/socket/socket.tsx";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../socket/socketContext";

function init_check(s:Socket<any, any> | null): boolean | undefined
{
  if (!s){
      return (
        false
      );
  }

}
type ballType = {
  x: number;
  y: number;
  radius: number;
  velocityY: number;
  velocityX: number;
  speed: number;
  color: string;
};
type playerType = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;
};
const Game = () => {
  const { socket } = useContext<any | undefined>(SocketContext);
  if(!init_check(socket))
  {
    console.log("log");
    return (<div>

    </div>);
  }
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationFrameIdRef: number = 0;
  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    // if (window.innerWidth >= 1600 && window.innerHeight > 800)
    // canvas.style.width = '1600px';
    // else if (window.innerWidth >= 1000 && window.innerHeight > 500)
    // canvas.style.width = '1000px';
    // else if (window.innerWidth >= 700 && window.innerHeight > 350)
    // canvas.style.width = '700px';
    // else
    // canvas.style.width = '300px';

    // window.addEventListener('resize', handleResize=>{
    //     if (window.innerWidth >= 1600 && window.innerHeight > 800)
    //     canvas.style.width = '1400px';
    //     else if (window.innerWidth >= 1000 && window.innerHeight > 500)
    //     canvas.style.width = '800px';
    //     else if (window.innerWidth >= 700 && window.innerHeight > 350)
    //     canvas.style.width = '600px';
    //     else
    //     canvas.style.width = '300px';
    //     canvas.style.top = window.innerHeight / 6 + 'px';
    // });
    // canvas.style.border = '3px solid black';
    // canvas.style.borderRadius = '25px';
    // canvas.style.position = 'relative';
    // canvas.style.top = window.innerHeight / 120 + 'px';
    let ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.width * 0.5;
    type modeType = {
      pColor: string;
      bColor: string;
      fColor: string;
      bMode: string;
    };
    let modeControl: modeType = {
      pColor: "WHITE",
      bColor: "GRAY",
      fColor: "BLACK",
      bMode: "",
    };
    // console.log(">>>>" + socket)
    socket?.on("initGame", (eMode: modeType) => {
      if (eMode) modeControl = eMode;
      // navigate("/home");
      console.log("hellllllllllo");
    });
    let player1: playerType = {
      x: 0,
      y: canvas.height / 2 - canvas.height / 4 / 2,
      width: canvas.width / 70,
      height: canvas.height / 4,
      color: modeControl.pColor,
      score: 0,
    };
    let player2: playerType = {
      x: canvas.width - canvas.width / 70,
      y: canvas.height / 2 - canvas.height / 4 / 2,
      width: canvas.width / 70,
      height: canvas.height / 4,
      color: modeControl.pColor,
      score: 0,
    };
    let net = {
      x: canvas.width / 2,
      y: 10,
      width: 2,
      height: 10,
      color: "WHITE",
      score: 0,
    };
    let ball: ballType = {
      x: canvas.width / 2 - canvas.width / 380,
      y: canvas.height / 2,
      radius: canvas.width / 60,
      speed: 15,
      velocityX: 5,
      velocityY: 5,
      color: modeControl.bColor,
    };
    let dy: number = 0;

    function userInputs(): void {
      document.onkeydown = (event: KeyboardEvent) => {
        if (event.key == "ArrowUp") {
          dy = -1;
        } else if (event.key == "ArrowDown") {
          dy = 1;
        }
      };
      document.onkeyup = (event: KeyboardEvent) => {
        if (event.key == "ArrowUp" || event.key == "ArrowDown") {
          dy = 0;
        }
      };
    }
    if(modeControl.bMode == "2")
      ball.radius = (ball.radius * 2)/3;
    function drawRect(
      x: number,
      y: number,
      w: number,
      h: number,
      color: string
    ): void {
      context.fillStyle = color;
      context.fillRect(x, y, w, h);
    }

    function drawCircle(x: number, y: number, r: number, color: string): void {
      context.fillStyle = color;
      if (modeControl.bMode == "1")
        context.fillRect(x - r, y - r, r * 2, r * 2);
      else {
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
      }
    }
    function drawText(text: any, x: number, y: number, color: string): void {
      context.fillStyle = color;
      context.font = "150px fantasy";
      context.fillText(text, x, y);
    }

    function drawNet(): void {
      for (let i = 0; i < canvas.height; i += 15)
        drawRect(net.x, i, net.width, net.height, net.color);
    }

    function render(): void {
      drawRect(0, 0, canvas.width, canvas.height, modeControl.fColor);
      drawRect(
        player1.x,
        player1.y,
        player1.width,
        player1.height,
        player1.color
      );
      drawRect(
        player2.x,
        player2.y,
        player2.width,
        player2.height,
        player2.color
      );
      drawText(player1.score, canvas.width / 4, canvas.height / 5, "WHITE");
      drawText(
        player2.score,
        (3 * canvas.width) / 4,
        canvas.height / 5,
        "WHITE"
      );
      drawNet();
      drawCircle(ball.x, ball.y, ball.radius, ball.color);
    }

    function update() {
      if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        ball.velocityY = -ball.velocityY;
      }
      player1.y += dy * ball.speed;
      if (player1.y + player1.height >= canvas.height)
        player1.y = canvas.height - player1.height;
      else if (player1.y <= 0) player1.y = 0;
      if (player2.y + player2.height > canvas.height)
        player2.y = canvas.height - player2.height;
      else if (player2.y < 0) player2.y = 0;
    }
    type dataForm = { y: number };
    function game() {
      let data: dataForm = {
        y: player1.y,
      };
      let dim: { W: number; H: number } = {
        W: canvas.width,
        H: canvas.height,
      };
      socket?.emit("ServerToClient", data);
      let message = {
        ball: ball,
        player1: player1,
        player2: player2,
        dim: dim,
      };
      socket?.emit("ballMove", message);
      update();
      render();
      requestAnimationFrame(game);
    }
    userInputs();
    socket?.on("ServerToClient", (data: dataForm) => {
      player2.y = data.y;
    });
    socket?.on(
      "ballMove",
      (message: {
        ball: ballType;
        player1: playerType;
        player2: playerType;
        dim: { W: number; H: number };
      }) => {
        ball = message.ball;
        player1.score = message.player1.score;
        player2.score = message.player2.score;
      }
    );
    socket?.on("thisIsStream", (message) => {
      document.onkeydown = (event: KeyboardEvent) => {
        event.preventDefault();
      };
      let dim = {
        room: message,
        matchID: 0,
        player1:0,
        player2:0
      };
      socket?.emit("newStreamRoom", dim);
      socket?.emit("joinStreamRoom", message);
    });
    socket?.on("streaming", (message) => {
      ball = message.ball;
      player1 = message.player1;
      player2 = message.player2;
    });

    socket?.on("gameRequestResponse", (data) => {
      console.log("Received data from server:", data);
      // Perform actions with the received data
    });
    game();
    return () => {
      cancelAnimationFrame(animationFrameIdRef);
      // socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="mainDisplay">
      <canvas ref={canvasRef} id="pong" />
    </div>
  );
};


export default Game;