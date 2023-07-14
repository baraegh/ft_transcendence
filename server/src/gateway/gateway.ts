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
    origin: ['http://localhost:5173'],
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

  handleConnection(client: Socket) {
    const user = Array.isArray(client.handshake.query.user)
      ? client.handshake.query.user[0]
      : client.handshake.query.user;
    console.log(decodeURIComponent(user));

    if (decodeURIComponent(user) !== "undefined") {
      const decodedUser = JSON.parse(decodeURIComponent(user));
      const userSocket = this.getUserSocket(client.data.userId);
      if (!userSocket) {
        client.data.userId = decodedUser.id;
        const token = this.auth.generateToken(client.data.userId);
        console.log('New client connected:', client.data.userId);
        console.log('New client connected:', client.data.userId);
        client.data.token = token;
        this.connectedUsers.set(client.data.userId, client);
      }
    }
  }
  async handleDisconnect(client: Socket) {
    // this.auth.verifyToken(client.data.token, client); 
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
    console.log("client: ", client.data.userId, " just left");
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
      console.log(' client connected:', cdata.userId);
    }
  }

  @SubscribeMessage('send_status')
  send_status(client: Socket, userid: number) {
    const userSocket = this.connectedUsers.get(userid);

    console.log(`${userid} : `, userSocket ? 'online' : 'offline');

    let st: string;
    if (userSocket)
      st = 'online';
    else
      st = 'offline';
    this.server.to(client.id).emit('get_status', st);
  }


  @SubscribeMessage('sendGameRequest')
  sendGameRequest(
    client: Socket,
    data: { player2Id: number; mode: modeType; name: string; image: string },
  ) {
    this.auth.verifyToken(client.data.token, client);
    const userSocket = this.connectedUsers.get(data.player2Id);
    if (!userSocket) {
      console.log("faild sendGameRequest");
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
      console.log(`User ${client.data.userId} sent:`, dataTogame);
    }
  }
  
  @SubscribeMessage('quick_game')
 async quick_game(
    client: Socket,
    data: { player2Id: number; mode: modeType; name: string; image: string },
  ) {
    data.player2Id = this.clientidtouseris.get(client.id);
    this.auth.verifyToken(client.data.token, client);
    const all_online: number[] = Array.from(this.connectedUsers.keys());
    const the_not_one = await this.prisma.match_History.findMany({
      where: {
        OR: [
          { user1Id: { in: all_online }  },
          { user2Id: { in: all_online } },
        ],
      },
    });

    const not_playing = all_online.filter((user) => {
      return the_not_one.some(
        (match) => (match.user1Id === user  && match.user1Id != data.player2Id) 
        || (match.user2Id === user && match.user2Id != data.player2Id)
      );
    });
    console.log("hi server "+ " ",not_playing.length);

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
      console.log(`User ${data.userId} sent:`, data);
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
      console.log(client.data.userId + ' sent ' + message);
    } else {
      console.log(
        client.data.userId + ' is not a member of room ' + message.room,
      );
    }
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string) {
    this.auth.verifyToken(client.data.token, client);
    if (!this.rooms.has(room)) {
      this.rooms.add(room);
      console.log(client.data.userId + ' just arrived');
    }
    client.join(room);
    client.emit('joinedRoom', room);
  }
  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string) {
    this.auth.verifyToken(client.data.token, client);
    client.leave(room);
    client.emit('leftRoom', room);
    console.log(client.data.userId + ' just left');
    const clientsInRoom = this.rooms.size;
    if (!clientsInRoom || clientsInRoom === 0) {
      this.rooms.delete(room);
    }
  }

  afterInit(server: Server) {
    this.server = server;
  }
}