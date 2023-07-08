import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthLogic } from './getwayLogic';

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
  constructor(private readonly auth: AuthLogic) {}
  private server: Server;


  private rooms: Set<string> = new Set<string>();
  private connectedUsers: Map<number, Socket> = new Map<number, Socket>();

  handleConnection(client: Socket) {
    const user = Array.isArray(client.handshake.query.user)
    ? client.handshake.query.user[0]
    : client.handshake.query.user;
    console.log(decodeURIComponent(user) );
     
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
  handleDisconnect(client: Socket) {
    // this.auth.verifyToken(client.data.token, client); 
    console.log("client: ",client.data.userId," just left");
    this.connectedUsers.delete(client.data.userId);
  }
  @SubscribeMessage('connect')
  handleconnect(client:Socket,  data:{ userId: number, cData: object}){

  }
  
  @SubscribeMessage('sendGameRequest')
  sendGameRequest(client:Socket,  data: {player2Id: number, mode: modeType ,name: string;image: string}) {
    this.auth.verifyToken(client.data.token, client);
    const userSocket = this.connectedUsers.get(data.player2Id);

    const dataTogame = {
      player1Id: client.id,
      player2Id: userSocket.id,
      mode: data.mode,
    };
    if (userSocket) {
      this.server.to(userSocket.id).emit('gameRequestResponse', dataTogame); 
      console.log(`User ${client.data.userId} sent:`, dataTogame);
    }
  }
  
  @SubscribeMessage('sendFriendRequest')
  sendFriendRequest(client:Socket, data:{ userId: number, cData: object}): void {
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