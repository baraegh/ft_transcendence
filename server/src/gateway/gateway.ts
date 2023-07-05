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

  private connectedUsers: Map<string, Socket> = new Map<string, Socket>();

  handleConnection(client: Socket) {
    const user = Array.isArray(client.handshake.query.user)
      ? client.handshake.query.user[0]
      : client.handshake.query.user;
    const decodedUser = JSON.parse(decodeURIComponent(user));
    client.data.userId = decodedUser.id;
    const token = this.auth.generateToken(client.data.userId);
    console.log('New client connected:', client.data.userId);
    client.data.token = token;
  }
  handleDisconnect(client: Socket) {
    this.auth.verifyToken(client.data.token, client);
  }

  sendGameRequest(userId: string, data:object): void {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      userSocket.emit('data', data);
    }
  }
  // Inject the socket.io server instance
  afterInit(server: Server) {
    this.server = server;
  }
}
