import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

@Injectable()
export class AuthLogic {
  constructor(private config: ConfigService) {}

  private readonly secretKey = this.config.get<string>('SECRETE_TOKEN_SOCKET');
  generateToken(UserID: number): string {
    const payload = { sub: UserID };
    const tokenPayload = { payload };
    return jwt.sign(tokenPayload, this.secretKey);
  }

  verifyToken(token: string,client:Socket) {
    try {
        if (!client.data.token || !jwt.verify(token, this.secretKey) ) {
          return
        }
      } catch (error) {
        // Handle the ForbiddenException or other errors
        client.emit('error', { 
            message: error.message,
            code: error.getStatus(),
          });
        // console.error('Error occurred during WebSocket disconnect:', error.message);
      }
  }
}