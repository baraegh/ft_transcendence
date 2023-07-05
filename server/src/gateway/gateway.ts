import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthLogic } from './getwayLogic';
import {
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
        client.data.userId = decodedUser.id;
        const token = this.auth.generateToken(client.data.userId);
        console.log('New client connected:', client.data.userId);
        client.data.token = token;
        this.connectedUsers.set( client.data.userId, client);
      }
   
  }
  handleDisconnect(client: Socket) {
    this.auth.verifyToken(client.data.token, client);
    this.connectedUsers.delete(client.data.userId);
  }

  sendGameRequest(userId: number, data:object): void {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      userSocket.emit('sendGameRequest', data);
    }
  }
  // Inject the socket.io server instance
  afterInit(server: Server) {
    this.server = server;
  }
}
