import {
    Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { FRIEND_REQ } from 'src/friends/dtos';
import { ChatService } from './chat.service';

@ApiBearerAuth()
@ApiTags('chat')
@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
    constructor(private chat:ChatService){}
  @HttpCode(HttpStatus.OK)
  @Post('join')
  async joinchat(@Req() req: Request, @Body() body: FRIEND_REQ) {
    const senderId = req.user['id'];
    const receiverId = body.receiverId;
    try {
        await this.chat.joinchat(senderId, receiverId);
      } catch (error) {
        console.error('Failed to send friendship request:', error);
      }
  }
}
