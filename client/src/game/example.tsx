import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../socket/socketContext";
import "./game.css"

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
type modeType = {
  pColor: string;
  bColor: string;
  fColor: string;
  bMode: string;
};
const Game = () => {
  const { socket } = useContext<any | undefined>(SocketContext);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationFrameIdRef: number = 0;

  const [player1, setPlayer1] = useState<playerType>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: "",
    score: 0,
  })
  const [player2, setPlayer2] = useState<playerType>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: "",
    score: 0,

  })
  const [ball, setBall] = useState<ballType>({
    x: 0,
    y: 0,
    radius: 0,
    speed: 0,
    velocityX: 0,
    velocityY: 0,
    color: "",

  })
  useEffect(() => {

    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    let ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.width * 0.5;

    let modeControl: modeType = {
      pColor: "BLACK",
      bColor: "WHITE",
      fColor: "GRAY",
      bMode: "2",
    };

    let net = {
      x: canvas.width / 2,
      y: 10,
      width: 2,
      height: 10,
      color: modeControl.bColor,
      score: 0,
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
      if (modeControl.bMode == "3")
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
      context.font = (canvas.width / 30) + "px fantasy";
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
      drawText(player1.score, canvas.width / 4, canvas.height / 5, modeControl.pColor);
      drawText(
        player2.score,
        (3 * canvas.width) / 4,
        canvas.height / 5,
        modeControl.pColor
      );
      drawNet();
      drawCircle(ball.x, ball.y, ball.radius, ball.color);
    }

    function update(): playerType {
      player1.y += dy * ball.speed;
      if (player1.y + player1.height >= canvas.height)
        player1.y = canvas.height - player1.height;
      else if (player1.y <= 0)
        player1.y = 0;
      if (player2.y + player2.height >= canvas.height)
        player2.y = canvas.height - player2.height;
      else if (player2.y <= 0)
        player2.y = 0;
      return (player1);
    }
    function game() {
      let dim: { W: number; H: number } = {
        W: canvas.width,
        H: canvas.height,
      };
      let message = {
        ball: ball,
        player1: player1,
        player2: player2,
        dim: dim,
      };
      let msg: { y: number; h: number } = {
                y: player1.y, 
                h: canvas.height}
      update();
      render();
      socket.emit("clientToServer", msg);
      socket.emit("ballMove", message);
      requestAnimationFrame(game);
    }
      socket.on("ServerToClient", (msg: { y: number; h: number }) => {
        const heightScale = canvas.height / msg.h;
        const newY = msg.y * heightScale;
        player2.y = newY;
      });
    socket.on("ballMoveCatch", (message: { ball: ballType, player1: playerType, player2: playerType, dim: { W: number, H: number } }) => {
      const widthScale = canvas.width / message.dim.W;
      const heightScale = canvas.height / message.dim.H;
      const newX = message.ball.x * widthScale;
      const newY = message.ball.y * heightScale;
      const newSpeedX = (message.ball.velocityX / message.dim.W) * canvas.width;
      const newSpeedY = (message.ball.velocityY / message.dim.H) * canvas.height;
      message.ball.velocityX = newSpeedX;
      message.ball.velocityY = newSpeedY;
      ball.x = newX;
      ball.y = newY;
      ball.radius = message.ball.radius;
      // ball.speed = message.ball.speed;
      ball.velocityX = message.ball.velocityX;
      ball.velocityY = message.ball.velocityY;
      ball.color = message.ball.color;
      player1.score = message.player1.score;
      player2.score = message.player2.score;
    }
    );
    socket.on("streaming", (message: { ball: ballType, player1: playerType, player2: playerType, dim: { W: number, H: number } }) => {
      document.onkeydown = null;
      document.onkeyup = null;
      // socket.off("ServerToClient");
      const widthScale = canvas.width / message.dim.W;
      const heightScale = canvas.height / message.dim.H;
      const newX = message.ball.x * widthScale;
      const newY = message.ball.y * heightScale;
      const newSpeedX = (message.ball.velocityX / message.dim.W) * canvas.width;
      const newSpeedY = (message.ball.velocityY / message.dim.H) * canvas.height;
      message.ball.velocityX = newSpeedX;
      message.ball.velocityY = newSpeedY;
      ball.x = newX;
      ball.y = newY;
      // ball.radius = message.ball.radius;
      // ball.speed = message.ball.speed;
      ball.velocityX = message.ball.velocityX;
      ball.velocityY = message.ball.velocityY;
      ball.color = message.ball.color;
      player1.y = message.player1.y * widthScale;
      player2.y = message.player2.y * widthScale;
      player1.score = message.player1.score;
      player2.score = message.player2.score;
    });
    socket.on("playerDisconnected", (message: string) => {
      document.onkeydown = null;
      document.onkeyup = null;
      socket.off("ServerToClient");
      socket.off("ballMove");
      socket.off("streaming");
      socket.off("playerDisconnected");
      socket.off("GameEnd");
      // socket.disconnect();
      navigate('/profile')
      document.location.reload();
    });
    socket.on("GameEnd", (message: string) => {
      player1.score = 0;
      player1.score = 0;
      document.onkeydown = null;
      document.onkeyup = null;
      socket.off("ServerToClient");
      socket.off("ballMove");
      socket.off("streaming");
      socket.off("playerDisconnected");
      socket.off("GameEnd");
      socket.off("initStream");
      cancelAnimationFrame(animationFrameIdRef);
      // socket.disconnect();
      navigate('/profile')
      document.location.reload();
    });
    socket.on("initStream", (eMode: modeType) => {
      player1.x = 0;
      player1.y = canvas.height / 2 - canvas.height / 4 / 2;
      player1.width = canvas.width / 70;
      player1.height = canvas.height / 4;
      player1.color = modeControl.pColor;
      player1.score = 0;
      // setPlayer2({
      player2.x = canvas.width - canvas.width / 70;
      player2.y = canvas.height / 2 - canvas.height / 4 / 2;
      player2.width = canvas.width / 70;
      player2.height = canvas.height / 4;
      player2.color = modeControl.pColor;
      player2.score = 0;
      // });
      ball.x = canvas.width / 2 - canvas.width / 380;
      ball.y = canvas.height / 2;
      ball.radius = canvas.width / 60;
      ball.speed = ((3 * canvas.width) / 4)/50;
      ball.velocityX = 5;
      ball.velocityY = 5;
      ball.color = modeControl.bColor;

      if (eMode){
        modeControl = eMode;
        player1.color = modeControl.pColor;
        player2.color = modeControl.pColor;
        ball.color = modeControl.bColor;
        net.color = ball.color;
        if (eMode.bMode == '2')
          ball.radius = ball.radius * 2
      }
      
      // socket.off("initGame");
      game();
    })
    socket.on("initGame", (eMode: modeType) => {
      player1.x = 0;
      player1.y = canvas.height / 2 - canvas.height / 4 / 2;
      player1.width = canvas.width / 70;
      player1.height = canvas.height / 4;
      player1.color = modeControl.pColor;
      player1.score = 0;
      // setPlayer2({
      player2.x = canvas.width - canvas.width / 70;
      player2.y = canvas.height / 2 - canvas.height / 4 / 2;
      player2.width = canvas.width / 70;
      player2.height = canvas.height / 4;
      player2.color = modeControl.pColor;
      player2.score = 0;
      // });
      ball.x = canvas.width / 2 - canvas.width / 380;
      ball.y = canvas.height / 2;
      ball.radius = canvas.width / 60;
      ball.speed = ((3 * canvas.width) / 4)/ 50;
      ball.velocityX = 5;
      ball.velocityY = 5;
      ball.color = modeControl.bColor;

      if (eMode)
        modeControl = eMode;
        player1.color = modeControl.pColor;
        player2.color = modeControl.pColor;
        ball.color = modeControl.bColor;
        net.color = ball.color;
      if (eMode.bMode == '2')
      ball.radius = ball.radius * 2
      userInputs();
      socket.off("initGame");
      game();
    });
    return () => {
      cancelAnimationFrame(animationFrameIdRef);
      // navigate('/home')
      // document.location.reload();
    };
  }, []);

  return (
    <div className="the-game">
      <canvas ref={canvasRef} id="pong" className="game-layout" />
    </div>
  );
};


export default Game;