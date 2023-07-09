import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type ballType ={x: number, y:number,radius:number , velocityY: number, velocityX: number, speed: number, color: string};
type playerType={x: number, y: number, width: number, height: number, color: string, score: number};
type modeType = {pColor: string, bColor: string, fColor:string, bMode:string};
type streaming = {roomName: string, client1Id: string, client2Id: string, player1Id: number, player2Id: number};
@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect{
  private logger: Logger = new Logger("GameGateway");
  games = new Map<number, {player1Id: string, player2Id: string, mode: modeType, numplayer1Id: number, numplayer2Id: number}>();
  socketId = new Map<number, Socket>();
  streaming = new Map<number,streaming>();
  users: number = 0;
  gameId: number = 0;
  @WebSocketServer() server: Server;
  @SubscribeMessage('gameStart')
  handleGameStart(client: Socket, data: {player1Id: string, player2Id: string, mode: modeType, numplayer1Id: number, numplayer2Id: number}):void {
    this.games.set(this.gameId, data);
    this.server.to(data.player1Id).emit('initGame', data.mode);
    this.server.to(client.id).emit('initGame', data.mode);
    this.streaming.set(this.gameId,{
      roomName: ("room_"+this.gameId ),
      client1Id: data.player1Id,
      client2Id: data.player2Id,
      player1Id: data.numplayer1Id,
      player2Id: data.numplayer2Id
    })
    this.gameId++;
  }
  handleDisconnect(client: Socket){
    if (this.games.get(this.getMatchID(client)).player1Id == client.id){
      this.server.to(this.games.get(this.getMatchID(client)).player2Id).emit('playerDisconnected', this.streaming.get(this.getMatchID(client)).player1Id);
    }
    else if  (this.games.get(this.getMatchID(client)).player2Id == client.id){
      this.server.to(this.games.get(this.getMatchID(client)).player1Id).emit('playerDisconnected', this.streaming.get(this.getMatchID(client)).player2Id);
    }
    this.games.delete(this.getMatchID(client))
  }
  getClientId(client: Socket): {player1Id: string, player2Id: string, mode: modeType}{
    for (let i: number = 0; i < this.games.size;i++){
      if (this.games.get(i).player1Id == client.id || this.games.get(i).player2Id == client.id)
        return this.games.get(i);
    }
    return undefined;
  }
  getMatchID(client: Socket): number{
    for (let i: number = 0; i < this.games.size;i++){
      if (this.games.get(i).player1Id == client.id || this.games.get(i).player2Id == client.id)
        return i;
    }
    return undefined;
  }
  getRoom(roomID: number): string{
    if  (this.streaming.get(roomID))
        return this.streaming.get(roomID).roomName;
    return undefined; 
  }
  
  @SubscribeMessage('ServerToClient')
  handleMessage( @ConnectedSocket() client: Socket, @MessageBody() message: {y: number, bVX: number, bVY: number}): void {
    let clientOb : {player1Id:string, player2Id: string,mode: modeType } = this.getClientId(client)
    if (clientOb){
      if (client.id == clientOb.player1Id){
        this.server.to(clientOb.player2Id).emit('ServerToClient', message);
      }
      else if (client.id == clientOb.player2Id){
        this.server.to(clientOb.player1Id).emit('ServerToClient', message);
      }
    }
  }
  @SubscribeMessage('ballMove')
  handelBall( @ConnectedSocket() client: Socket, @MessageBody() message:{ball: ballType, player1: playerType, player2: playerType, dim:{W:number, H: number}}){
    function ballMovement(ball:ballType, player1: playerType, player2: playerType, dim:{W: number, H: number }): ballType{
    function resetBall() {
      ball.x = message.dim.W / 2;
      ball.y = message.dim.H / 2;
      ball.velocityY = 5;
      ball.velocityX = -ball.velocityX;
      ball.speed = 15;
    }
    function collision(b, p):boolean{
      // players
      p.top = p.y;
      p.bottom = p.y + p.height;
      p.left = p.x;
      p.right = p.x + p.width;
      // ball
      b.top = b.y - b.radius;
      b.bottom = b.y + b.radius;
      b.left = b.x - b.radius;
      b.right = b.x + b.radius;
      return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;
    }
      if (ball.y + ball.radius >= message.dim.H || ball.y - ball.radius <= 0) {
        ball.velocityY = -ball.velocityY;
      }
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
        if (ball.x <= message.dim.W / 2) {
            if (collision(ball, player1)) {
                let collidePoint = (ball.y - (player1.y + player1.height / 2));
                collidePoint = collidePoint / (player1.height / 2);
                let angleRad = (Math.PI / 4) * collidePoint;
                ball.velocityX = ball.speed * Math.cos(angleRad);
                ball.velocityY = ball.speed * Math.sin(angleRad);
                ball.speed += 0.5;
            }
        }
        else if (ball.x >= dim.W / 2) {
            if (collision(ball, player2)) {
                let collidePoint = (ball.y - (player2.y + player2.height / 2));
                collidePoint = collidePoint / (player2.height / 2);
                let angleRad = (Math.PI / 4) * collidePoint;
                ball.velocityX = (ball.speed * Math.cos(angleRad)) * -1;
                ball.velocityY = ball.speed * Math.sin(angleRad);
                ball.speed += 0.5;
            }
        }
        if (ball.x - ball.radius < 0 && (ball.y < player1.y || ball.y > player1.y + player1.height)) {
            player2.score++;
            resetBall();
        }
        else if (ball.x + ball.radius > dim.W && (ball.y < player2.y || ball.y > player2.y + player2.height)) {
            player1.score++;
            resetBall();
        }
      return ball;
    }
    let clientOb : {player1Id:string, player2Id: string,mode: modeType } = this.getClientId(client)
    if (clientOb){
      message.ball = ballMovement(message.ball, message.player1, message.player2, message.dim);
      if (message.player1.score == 5 || message.player2.score == 5){
        this.server.to(clientOb.player1Id).emit('GameEnd', message);
        this.server.to(clientOb.player2Id).emit('GameEnd', message);
        this.games.delete(this.getMatchID(client));
        this.streaming.delete(this.getMatchID(client));
        this.gameId--;
      }
      // database
      if (client.id == clientOb.player1Id){
        this.server.to(clientOb.player1Id).emit('ballMove', message);
        this.server.to(this.getRoom(this.getMatchID(client))).emit('streaming', message);
      }
      if (client.id == clientOb.player1Id){
        message.ball.x = message.dim.W - message.ball.x;
        this.server.to(clientOb.player2Id).emit('ballMove', message);
      }
    }
  }

  @SubscribeMessage('exploreRooms')
  creatingRoom(client: Socket){
    this.server.to(client.id).emit('allRoomsData',this.streaming)
  }

  @SubscribeMessage('joinStreamRoom')
  handleJoinRoom(client: Socket, room: string){
    client.join(room);
  }

  @SubscribeMessage('leaveStreamRoom')
  handleLeaveRoom(client: Socket, room: string){
    client.leave(room);
  }
}