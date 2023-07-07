import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private rooms: Set<string> = new Set<string>();
  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('chatToServer')
  handleMessage(
    client: Socket,
    message: { sender: string; room: string; message: string },
  ) {
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
    if (!this.rooms.has(room)) {
      this.rooms.add(room);
      console.log(client.data.userId + ' just arrived');
    }
    client.join(room);
    client.emit('joinedRoom', room);
  }
  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
    console.log(client.data.userId + ' just left');
    const clientsInRoom = this.rooms.size;
    if (!clientsInRoom || clientsInRoom === 0) {
      this.rooms.delete(room);
    }
  }
}
