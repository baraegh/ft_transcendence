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
  ) {}
  private server: Server;

  private rooms: Set<string> = new Set<string>();
  private connectedUsers: Map<number, Socket> = new Map<number, Socket>();
  private connectedhandelconnect: Map<string, Socket> = new Map<
    string,
    Socket
  >();

  handleConnection(client: Socket) {
    const token = this.auth.generateToken(client.data.userId);
    console.log('New client connected:', client.id);
    client.data.token = token;
    this.connectedhandelconnect.set(client.id, client);
  }


  handleDisconnect(client: Socket) {
    // this.auth.verifyToken(client.data.token, client);
    console.log('client: ', client.data.userId, ' just left');
    this.connectedUsers.delete(client.data.userId);
  }
  @SubscribeMessage('connect01')
  handleconnect(client: Socket, cdata: { userId: number }) {
    client.data.userId = cdata.userId;
    if(this.connectedUsers.get(cdata.userId) == undefined)
    {
      this.connectedUsers.set(client.data.userId, client);
      console.log(' client connected:', cdata.userId);
    }
  }

  @SubscribeMessage('sendGameRequest')
  sendGameRequest(
    client: Socket,
    data: { player2Id: number; mode: modeType; name: string; image: string },
  ) {
    this.auth.verifyToken(client.data.token, client);
    const userSocket = this.connectedUsers.get(data.player2Id);
    if(!userSocket)
    {
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
    message: { sender: string; room: string; message: string },
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
