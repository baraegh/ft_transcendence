import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { FRIEND_REQ } from 'src/friends/dtos';
import { ChatService } from './chat.service';
import { CREATEGROUPSDTO, FETCHMSG, MSGDTO } from './dto';
import { HttpStatusCode } from 'axios';
import { FetchChatService } from './fetchChat.servise';



@ApiBearerAuth()
@ApiTags('chat')
@UseGuards(JwtGuard)
@Controller('chat')
@ApiResponse({ status: 200, description: 'Successful response' })
export class ChatController {
  constructor(private chat: ChatService, private fetshchat: FetchChatService) {}

  @ApiOperation({ summary: 'make channel with friend if not exist' })
  @ApiResponse({
    description:
      'Returns id of channel string like: 794c9ac3-fa09-4a2d-9d7e-0dd2a531624e',
  })
  @HttpCode(HttpStatus.OK)
  @Post('join-friend')
  async joinchat(@Req() req: Request, @Body() body: FRIEND_REQ) {
    const senderId = req.user['id'];
    const receiverId = body.receiverId;
    try {
      return await this.chat.joinchatwithFriend(senderId, receiverId);
    } catch (error) {
      console.error('Failed to join chat:', error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('send-msg')
  async SendMsg(@Req() req: Request, @Body() body: MSGDTO) {
    const senderId = req.user['id'];
    const channelId = body.channelID;
    const content = body.content;
    await this.chat.sendMsg(channelId, senderId, content);
  }

  @ApiResponse({
    description: 'Returns id of channel ',
  })
  @Post('create-goupe')
  async CreateGroup(@Req() req: Request, @Body() body: CREATEGROUPSDTO) {
    const ownerId = req.user['id'];
    return await this.chat.CreateGroup(ownerId, body);
  }

  @ApiOperation({ summary: 'get msg , accept in body => channelId : string '})
  @ApiResponse({
    description: 'Returns an  array of messages ordered with time',
    type:FETCHMSG ,
  })
  @Get('all-msg')
  async ShowAllMsgsOfChannel(@Body() channelId: { channelId: string }):Promise<FETCHMSG[]> {
    return await this.fetshchat.ShowAllMsgsOfChannel(channelId.channelId);
  }
}
