import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthLogic } from './getwayLogic';
import {
  Body,
  ForbiddenException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['POST', 'PUT', 'GET', 'PATCH'],
  },
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly auth: AuthLogic) {}
  private server: Server;

  private connectedUsers: Map<number, Socket> = new Map<number, Socket>();

  handleConnection(client: Socket) {
    const user = Array.isArray(client.handshake.query.user)
      ? client.handshake.query.user[0]
      : client.handshake.query.user;
     
      if(decodeURIComponent(user) != "undefined"  )
      {
        
        const decodedUser = JSON.parse(decodeURIComponent(user));
        const userSocket = this.getUserSocket( client.data.userId);
        if(!userSocket){
          client.data.userId = decodedUser.id;
          const token = this.auth.generateToken(client.data.userId);
          console.log('New client connected:', client.data.userId);
          client.data.token = token;
          this.connectedUsers.set( client.data.userId, client);
        }
      }
   
  }
  handleDisconnect(client: Socket) {
    this.auth.verifyToken(client.data.token, client);
    console.log("client: ",client.data.userId," just left");
    this.connectedUsers.delete(client.data.userId); 
  }

  
  @SubscribeMessage('sendGameRequest')
  sendGameRequest(client:Socket, @MessageBody() data:{ userId: number, cData: object}): void {
    this.auth.verifyToken(client.data.token, client);
    const userSocket = this.connectedUsers.get(data.userId);
    if (userSocket) {
      this.server.to(userSocket.id).emit('gameRequestResponse', data); 
      console.log(`User ${data.userId} sent:`, data);
    }
  }
  

  @SubscribeMessage('sendFriendRequest')
  sendFriendRequest(client:Socket, @MessageBody() data:{ userId: number, cData: object}): void {
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

  // Inject the socket.io server instance
  afterInit(server: Server) {
    this.server = server;
  }
}
