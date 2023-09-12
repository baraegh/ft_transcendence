import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthLogic } from './getwayLogic';
import { PrismaService } from 'src/prisma/prisma.service';

type modeType = {
  pColor: string;
  bColor: string;
  fColor: string;
  bMode: string;
};
@WebSocketGateway({
  cors: {
    origin: [process.env.FRONTEND_URL],
    methods: ['POST', 'PUT', 'GET', 'PATCH'],
  },
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly auth: AuthLogic,
    private prisma: PrismaService,
  ) { }
  private server: Server;

  private rooms: Set<string> = new Set<string>();
  private connectedUsers: Map<number, Socket> = new Map<number, Socket>();
  private clientidtouseris: Map<string, number> = new Map<
    string,
    number
  >();

  private allcilients: Map<string, Socket> = new Map<string,Socket>();

  handleConnection(client: Socket) {
    this.allcilients.set(client.id,client);
    const user = Array.isArray(client.handshake.query.user)
      ? client.handshake.query.user[0]
      : client.handshake.query.user;

    if (decodeURIComponent(user) !== "undefined") {
      const decodedUser = JSON.parse(decodeURIComponent(user));
      const userSocket = this.getUserSocket(client.data.userId);
      if (!userSocket) {
        client.data.userId = decodedUser.id;
        const token = this.auth.generateToken(client.data.userId);
        client.data.token = token;
        this.connectedUsers.set(client.data.userId, client);
      }
    }
  }
  async handleDisconnect(client: Socket) {
    // this.auth.verifyToken(client.data.token, client); 
    this.allcilients.delete(client.id);
    const id:number = this.clientidtouseris.get(client.id);
    if(id)
    {
      const isonline = await this.prisma.user.update({
        where: {
          id: id,
        }
        , data: {
          isonline: false,
        }
      })

    }
    this.connectedUsers.delete(client.data.userId);
    this.clientidtouseris.delete(client.id);
  }
  @SubscribeMessage('connect01')
  async handleconnect(client: Socket, cdata: { userId: number }) {
    this.clientidtouseris.set(client.id, cdata.userId);
    const isonline = await this.prisma.user.update({
      where: {
        id: cdata.userId,
      }
      , data: {
        isonline: true,
      }
    });
    client.data.userId = cdata.userId;
    if (this.connectedUsers.get(cdata.userId) == undefined) {
      this.connectedUsers.set(client.data.userId, client);
    }
  }

  @SubscribeMessage('send_status')
  send_status(client: Socket, userid: number) {
    const userSocket = this.connectedUsers.get(userid);


    let st: string;
    if (userSocket)
      st = 'online';
    else
      st = 'offline';
    this.server.to(client.id).emit('get_status', st);
  }

  @SubscribeMessage('check')
  check(client: Socket, clientId: string) {
    const userSocket = this.allcilients.get(clientId);
    if(userSocket != undefined)
      this.server.to(client.id).emit('im_here', true);
    else
    this.server.to(client.id).emit('im_here', false);
  }


  @SubscribeMessage('sendGameRequest')
  sendGameRequest(
    client: Socket,
    data: { player2Id: number; mode: modeType; name: string; image: string },
  ) {
    this.auth.verifyToken(client.data.token, client);
    const userSocket = this.connectedUsers.get(data.player2Id);
    if (!userSocket) {
      return;
    }
    const dataTogame = {
      player1Id: client.id,
      player2Id: userSocket.id,
      mode: data.mode,
      numplayer1Id: client.data.userId,
      numplayer2Id: data.player2Id,
    };
    if (userSocket) {
      this.server.to(userSocket.id).emit('gameRequestResponse', dataTogame);
    }
  }
  
  @SubscribeMessage('quick_game')
  async quick_game(
     client: Socket,
     data: { mode: modeType; name: string; image: string },
   ) {
     this.auth.verifyToken(client.data.token, client);
     const p2id = this.clientidtouseris.get(client.id);
     const all_online: number[] = Array.from(this.connectedUsers.keys());
     const the_not_one = await this.prisma.match_History.findMany({
       where: {
         OR: [
           { user1Id: { in: all_online }, game_end: false },
           { user2Id: { in: all_online }, game_end: false },
         ],
       },
     });
     
     let not_playing = all_online.filter((user) => {
       return !the_not_one.some(
         (match) => match.user1Id === user || match.user2Id === user
       );
     });
      not_playing = not_playing.filter((num) => num !== p2id);
     if (not_playing.length > 0) {
       const randomIndex = Math.floor(Math.random() * not_playing.length);
       const randomUserId = not_playing[randomIndex];
       const userSocket = this.connectedUsers.get(randomUserId);
       const dataTogame = {
         player1Id: client.id,
         player2Id: userSocket.id,
         mode: data.mode,
         numplayer1Id: client.data.userId,
         numplayer2Id: randomUserId,
       };
       this.server.to(userSocket.id).emit('gameRequestResponse', dataTogame);
       console.log(`User ${client.data.userId} sent:`, dataTogame);
     }
   }

  @SubscribeMessage('sendFriendRequest')
  sendFriendRequest(
    client: Socket,
    data: { userId: number; cData: object },
  ): void {
    this.auth.verifyToken(client.data.token, client);
    const userSocket = this.connectedUsers.get(data.userId);
    if (userSocket) {
      this.server.to(userSocket.id).emit('FriendRequestResponse', data);
    }
  }

  getUserSocket(userId: number): Socket | undefined {
    return this.connectedUsers.get(userId);
  }

  @SubscribeMessage('chatToServer')
  handleMessage(
    client: Socket,
    message: { sender: number; room: string; message: string },
  ) {
    this.auth.verifyToken(client.data.token, client);
    if (client.rooms.has(message.room)) {
      this.server.to(message.room).emit('chatToClient', message);
    } else {
 
    }
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string) {
    this.auth.verifyToken(client.data.token, client);
    if (!this.rooms.has(room)) {
      this.rooms.add(room);
    }
    client.join(room);
    client.emit('joinedRoom', room);
  }
  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string) {
    this.auth.verifyToken(client.data.token, client);
    client.leave(room);
    client.emit('leftRoom', room);
    const clientsInRoom = this.rooms.size;
    if (!clientsInRoom || clientsInRoom === 0) {
      this.rooms.delete(room);
    }
  }

  afterInit(server: Server) {
    this.server = server;
  }
}