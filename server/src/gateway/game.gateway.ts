import { Logger, NotFoundException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Match_History } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { CREAT_GAME_DTO, EDIT_GAME_DTO, END_GAME_DTO } from 'src/game/game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
type ballType ={x: number, y:number,radius:number , velocityY: number, velocityX: number, speed: number, color: string};
type playerType={x: number, y: number, width: number, height: number, color: string, score: number};
type modeType = {pColor: string, bColor: string, fColor:string, bMode:string};
type streaming = {roomName: string, client1Id: string, client2Id: string, player1Id: number, player2Id: number};
type datatype = {player1Id: string, player2Id: string, mode: modeType, numplayer1Id: number, numplayer2Id: number};
@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect{
  constructor(private prisma:PrismaService){}
  private logger: Logger = new Logger("GameGateway");
  games = new Map<number, {player1Id: string, player2Id: string, mode: modeType, numplayer1Id: number, numplayer2Id: number}>();
  streaming = new Map<number,streaming>();
  gameIds = new Map<number, string>();
  gameId: number = 0;
  @WebSocketServer() server: Server;
  @SubscribeMessage('gameStart')
  async handleGameStart(client: Socket, data: {player1Id: string, player2Id: string, mode: modeType, numplayer1Id: number, numplayer2Id: number}) {
    let idp2 = {
      userid: data.numplayer2Id
    }
    this.logger.log(data.mode.bColor);
    const gameid = await this.creatGame( data.numplayer1Id,idp2);
    this.games.set(this.gameId, data);
    this.gameIds.set(this.gameId, gameid.id);
    this.server.to(data.player1Id).emit('startGame', data.mode);
    this.server.to(client.id).emit('startGame', data.mode);
    this.streaming.set(this.gameId,{
      roomName: ("room_"+this.gameId ),
      client1Id: data.player1Id,
      client2Id: data.player2Id,
      player1Id: data.numplayer1Id,
      player2Id: data.numplayer2Id
    })
    this.gameId++;
  }
  @SubscribeMessage('initGameToStart')
  handleGameInit(client: Socket, data: modeType){
    this.logger.log(data.fColor)
    this.server.to(client.id).emit('initGame', data);
  }
  async handleDisconnect(client: Socket){
    let winerid :number;
    let  losserid :number;
    if (this.games.get(this.getMatchID(client))){
      if (this.games.get(this.getMatchID(client)).player1Id == client.id){
        const dto = {
          GameId: this.gameIds.get(this.getMatchID(client)),
          user1P: 0,
          user2P: 1,
        }
        winerid = this.games.get(this.getMatchID(client)).numplayer2Id;
        losserid =this.games.get(this.getMatchID(client)).numplayer1Id;
        await this.editMatch(dto);
        this.server.to(this.games.get(this.getMatchID(client)).player2Id).emit('playerDisconnected', "you win the game");
      }
      else if  (this.games.get(this.getMatchID(client)).player2Id == client.id){
        const dto = {
          GameId: this.gameIds.get(this.getMatchID(client)),
          user1P: 1,
          user2P: 0,
        }
        losserid  = this.games.get(this.getMatchID(client)).numplayer2Id;
        winerid = this.games.get(this.getMatchID(client)).numplayer1Id;
        await this.editMatch(dto);
        this.server.to(this.games.get(this.getMatchID(client)).player1Id).emit('playerDisconnected', "you win the game");
      }
      const dto = {
        GameId: this.gameIds.get(this.getMatchID(client)),
        WinnerId:winerid,
        LosserId:losserid
      }
        await this.endMatch(winerid,dto);
      
      this.games.delete(this.getMatchID(client));
      this.gameIds.delete(this.getMatchID(client));
      this.streaming.delete(this.getMatchID(client));

      console.log("rah mxa")
    }
  }
  getClientId(client: Socket): {player1Id: string, player2Id: string, mode: modeType}{
    let game: datatype;
    this.games.forEach((value, key) => {
      if (value.player1Id == client.id || value.player2Id == client.id){
        game =  value;
      }
    });
    if (game)
      return game;
    return undefined;
  }
  getMatchID(client: Socket): number{
    let mKey: number = 0;
    this.games.forEach((value, key) => {
      if (value.player1Id == client.id || value.player2Id == client.id)
        mKey = key;
    });
    return mKey;
  }
  getRoom(roomID: number): string{
    if  (this.streaming.get(roomID))
        return this.streaming.get(roomID).roomName;
    return undefined; 
  }
  
  @SubscribeMessage('clientToServer')
  handleMessage(client: Socket,message: number): void {
    let clientOb : {player1Id:string, player2Id: string,mode: modeType } = this.getClientId(client)
    this.logger.log(client.id);
    if (clientOb){
      let nb = message;
      if (client.id == clientOb.player1Id){
        this.server.to(clientOb.player2Id).emit('ServerToClient', nb);
      }
      else if (client.id == clientOb.player2Id){
        this.server.to(clientOb.player1Id).emit('ServerToClient', nb);
      }
    }
  }
  @SubscribeMessage('ballMove')
  async handelBall( client: Socket,message:{ball: ballType, player1: playerType, player2: playerType, dim:{W:number, H: number}}){
    const getMatchID = this.getMatchID.bind(this);
    const gameIds = this.gameIds;
    const editMatch = this.editMatch.bind(this);
    async function ballMovement(ball:ballType, player1: playerType, player2: playerType, dim:{W: number, H: number }): Promise<ballType>{
    function resetBall() {
      ball.x = message.dim.W / 2;
      ball.y = message.dim.H / 2;
      ball.velocityY = 5;
      ball.velocityX = -ball.velocityX;
      ball.speed = ((3 * dim.W) / 4) / 300;
    }
     function collision(b, p):boolean{
      // players
      let pTop = p.y;
      let pbottom = p.y + p.height;
      let pleft = p.x;
      let pright = p.x + p.width;
      // ball
      let btop = b.y - b.radius;
      let bbottom = b.y + b.radius;
      let bleft = b.x - b.radius;
      let bright = b.x + b.radius;
      return bright > pleft && btop < pbottom && bleft < pright && bbottom > pTop;
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
                ball.speed += dim.W/ 2000;
            }
        }
        else if (ball.x >= dim.W / 2) {
            if (collision(ball, player2)) {
                let collidePoint = (ball.y - (player2.y + player2.height / 2));
                collidePoint = collidePoint / (player2.height / 2);
                let angleRad = (Math.PI / 4) * collidePoint;
                ball.velocityX = (ball.speed * Math.cos(angleRad)) * -1;
                ball.velocityY = ball.speed * Math.sin(angleRad);
                ball.speed += dim.W/ 2000;
            }
        }
        if (ball.x - ball.radius < 0 && (ball.y < player1.y || ball.y > player1.y + player1.height)) {
            player2.score++;
            if (client.id == clientOb.player2Id){
              const dto = {
                GameId: gameIds.get(getMatchID(client)),
                user1P: player1.score,
                user2P: player2.score,
              }
              await editMatch(dto);
            }
            resetBall();
          }
          else if (ball.x + ball.radius > dim.W && (ball.y < player2.y || ball.y > player2.y + player2.height)) {
            player1.score++;
            if (client.id == clientOb.player1Id){
              const dto = {
                GameId: gameIds.get(getMatchID(client)),
                user1P: player1.score,
                user2P: player2.score,
              }
              await editMatch(dto);
            }
              resetBall();
            }
            return ball;
          }
      let clientOb : {player1Id:string, player2Id: string,mode: modeType } = this.getClientId(client)
      if (clientOb){
        message.ball = await ballMovement(message.ball, message.player1, message.player2, message.dim);
        if (message.player1.score == 5 || message.player2.score == 5){
          let win: number;
          let losser: number;
          if (message.player1.score > message.player2.score){
            win = this.games.get(this.getMatchID(client)).numplayer1Id;
            losser = this.games.get(this.getMatchID(client)).numplayer2Id;
            this.server.to(clientOb.player1Id).emit('GameEnd',"winner  " + message.player1.score +"-"+message.player2.score);
            this.server.to(clientOb.player2Id).emit('GameEnd',"losser  " + message.player2.score +"-"+message.player1.score);
            message.player1.score = 0
            message.player2.score = 0
          }
          else{
            win = this.games.get(this.getMatchID(client)).numplayer2Id;
            losser = this.games.get(this.getMatchID(client)).numplayer1Id;
            this.server.to(clientOb.player1Id).emit('GameEnd', "losser  " + message.player1.score +"-"+message.player2.score);
            this.server.to(clientOb.player2Id).emit('GameEnd', "winner  " + message.player2.score +"-"+message.player1.score);
            message.player1.score = 0
            message.player2.score = 0
          }
          const dto = {
            GameId: gameIds.get(getMatchID(client)),
            WinnerId:win,
            LosserId:losser
          }
            await this.endMatch(win,dto);
            this.games.delete(this.getMatchID(client));
            this.streaming.delete(this.getMatchID(client));
            this.gameIds.delete(this.getMatchID(client));
          }
      if (client.id == clientOb.player1Id){
        this.server.to(clientOb.player1Id).emit('ballMove', message);
        this.server.to(this.getRoom(this.getMatchID(client))).emit('streaming', message);
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


  async editMatch( dto: EDIT_GAME_DTO): Promise<Match_History> {
    const findmatch = await this.prisma.match_History.findUnique({
      where: {
        id: dto.GameId,
      },
    });
    if (!findmatch) throw new NotFoundException('Match not found');
    if (findmatch.game_end == true)
      return;

    const editGame = await this.prisma.match_History.update({
      where: {
        id: dto.GameId,
      },
      data: {
        user1P: dto.user1P,
        user2P: dto.user2P,
      },
    });
    return editGame;
  }
  async creatGame(userid: number, dto: CREAT_GAME_DTO): Promise<Match_History> {
    const findotheruser = await this.prisma.user.findFirst({
      where: { id: dto.userid },
    });

    if (!findotheruser) throw new NotFoundException('other user not found');

    const creatmatch = await this.prisma.match_History.create({
      data: {
        user1Id: userid,
        user2Id: dto.userid,
        user1P: 0,
        user2P: 0,
      },
    });
    return creatmatch;
  }

  async endMatch(userid: number, dto: END_GAME_DTO): Promise<Match_History> {
    const findmatch = await this.prisma.match_History.findUnique({
      where: {
        id: dto.GameId,
      },
    });
    if (!findmatch) return;
    if (findmatch.game_end == true)
      return;

    const editGame = await this.prisma.match_History.update({
      where: {
        id: dto.GameId,
      },
      data: {
        game_end: true,
      },
    });
    let otherplayer: number;
    let userplayer: number;
    let winuser: boolean;
    if (editGame.user1Id === userid) {
      otherplayer = editGame.user2Id;
      userplayer = editGame.user1Id;
    } else {
      otherplayer = editGame.user1Id;
      userplayer = editGame.user2Id;
    }

     
    if (dto.WinnerId && dto.LosserId) {
      await this.prisma.user.update({
        where: { id: dto.WinnerId },
        data: { gameWon: { increment: 1 } },
      });
      await this.prisma.user.update({
        where: { id: dto.LosserId },
        data: { gameLost: { increment: 1 } },
      });
      return editGame;
    }

    if (editGame.user1P > editGame.user2P) winuser = true;
    else winuser = false;
    if(editGame.user1P === editGame.user2P) winuser = null;
    if (winuser === true) {
      await this.prisma.user.update({
        where: { id: userplayer },
        data: { gameWon: { increment: 1 } },
      });
      await this.prisma.user.update({
        where: { id: otherplayer },
        data: { gameLost: { increment: 1 } },
      });
    } else if(winuser === false) {
      await this.prisma.user.update({
        where: { id: userplayer },
        data: { gameLost: { increment: 1 } },
      });
      await this.prisma.user.update({
        where: { id: otherplayer },
        data: { gameWon: { increment: 1 } },
      });
    }
    else if(winuser === null)
    {
      await this.prisma.user.update({
        where: { id: userplayer },
        data: { gameLost: { increment: 1 } },
      });
      await this.prisma.user.update({
        where: { id: otherplayer },
        data: { gameLost: { increment: 1 } },
      });
    }
    return editGame;
  }

}