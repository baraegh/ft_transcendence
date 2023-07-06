import { io } from "socket.io-client";
const canvas = document.getElementById("pong") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

if (window.innerWidth >= 1600 && window.innerHeight > 800)
    canvas.style.width = '1600px';
else if (window.innerWidth >= 1000 && window.innerHeight > 500)
    canvas.style.width = '1000px';
else if (window.innerWidth >= 700 && window.innerHeight > 350)
    canvas.style.width = '700px';
else
    canvas.style.width = '300px';

window.addEventListener('resize', handleResize=>{
    if (window.innerWidth >= 1600 && window.innerHeight > 800)
        canvas.style.width = '1400px';
    else if (window.innerWidth >= 1000 && window.innerHeight > 500)
        canvas.style.width = '800px';
    else if (window.innerWidth >= 700 && window.innerHeight > 350)
        canvas.style.width = '600px';
    else
        canvas.style.width = '300px';
    canvas.style.top = window.innerHeight / 6 + 'px';
});
canvas.style.border = '3px solid black';
canvas.style.borderRadius = '25px';
canvas.style.position = 'relative';
canvas.style.top = window.innerHeight / 6 + 'px';
var ratio = window.devicePixelRatio || 1;
canvas.width = canvas.offsetWidth * ratio;
canvas.height = canvas.width * 0.5;
var player1 = {
    x: 0,
    y: canvas.height / 2 - (canvas.height/4)/2,
    width: canvas.width/70,
    height: canvas.height/4,
    color: "WHITE",
    score: 0
};
var player2 = {
    x: canvas.width - canvas.width/70,
    y: canvas.height / 2 - (canvas.height/4)/2,
    width: canvas.width/70,
    height: canvas.height/4,
    color: "WHITE",
    score: 0
};
var com = {
    x: canvas.width - canvas.width/70,
    y: canvas.height / 2 - (canvas.height/4)/2,
    width: canvas.width/70,
    height: canvas.height/4,
    color: "WHITE",
    score: 0
};
var net = {
    x: canvas.width / 2,
    y: 10,
    width: 2,
    height: 10,
    color: "WHITE",
    score: 0
};
var ball = {
    x: canvas.width / 2 - (canvas.width/380),
    y: canvas.height / 2,
    radius: canvas.width/60,
    speed: 15,
    velocityX: 5,
    velocityY: 5,
    color: "GRAY"
};
let dy:number = 0;

function userInputs(): void{
    document.onkeydown =  (event: KeyboardEvent)=>  {
        if (event.key == "ArrowUp"){
            dy = -1;
        }
        else if (event.key == "ArrowDown"){
            dy = 1;
        }
    }
    document.onkeyup =  (event: KeyboardEvent)=>  {
        if (event.key == "ArrowUp" || event.key == "ArrowDown"){
            dy = 0;
        }
    }
}

function drawRect(x:number, y:number, w:number, h:number, color:string) : void{
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawCircle(x:number, y:number, r:number, color:string) :void{
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}
function drawText(text : any, x: number, y: number, color:string) :void{
    context.fillStyle = color;
    context.font = "150px fantasy";
    context.fillText(text, x, y);
}

function drawNet():void{
    for (let i = 0; i < canvas.height; i+=15)
    drawRect(net.x, i, net.width, net.height, net.color);
    
}

function render() : void{
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");
    drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
    drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);
    drawText(player1.score, canvas.width/4, canvas.height/5, "WHITE");
    drawText(player2.score, 3 * canvas.width/4, canvas.height/5, "WHITE");
    drawNet();
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function update(){
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0){
        ball.velocityY = -ball.velocityY;
    }
    player1.y += dy * ball.speed;
    if (player1.y + player1.height >= canvas.height)
        player1.y = canvas.height- player1.height;
    else if (player1.y <= 0)
        player1.y = 0;
    if (player2.y + player2.height > canvas.height)
        player2.y = canvas.height- player2.height;
    else if (player2.y < 0)
        player2.y = 0;
}
const socket = io('http://localhost:3000/');
type dataForm = {y: number};
function game() {
    let data: dataForm = {
        y: player1.y,
    };
    let dim:{W:number, H: number }  = {
        W: canvas.width,
        H: canvas.height
    };
    socket.emit('ServerToClient', data);
    let message = {ball: ball, player1:player1, player2:player2, dim:dim}
    socket.emit('ballMove', message);
    update();
    render();
    userInputs();
    requestAnimationFrame(game);
}
socket.on('ServerToClient', (data: dataForm) => {
    player2.y = data.y;
});
socket.on('ballMove', (message) => {
    ball = message.ball;
});
game();