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
  ApiParam,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { FRIEND_REQ } from 'src/friends/dtos';
import { ChatService } from './chat.service';
import {
  ABOUTDTO,
  CREATEGROUPSDTO,
  ChannelGroupInfoDTO,
  ChannelInfoDTO,
  FETCHMSG,
  MSGDTO,
  PersonelChannelInfoDTO,
  SHOWCHATDTO,
} from './dto';
import { HttpStatusCode } from 'axios';
import { FetchChatService } from './fetchChat.servise';
import { OWNERDTO } from './dto/owner.dto';
import { ChatOwnerService } from './chatOwner.service';

@ApiBearerAuth()
@ApiTags('chat')
@UseGuards(JwtGuard)
@Controller('chat')
@ApiResponse({ status: 200, description: 'Successful response' })
export class ChatController {
  constructor(
    private chat: ChatService,
    private fetshchat: FetchChatService,
  ) {}

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
    return await this.chat.joinchatwithFriend(senderId, receiverId);
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

  @ApiOperation({ summary: 'get msg , accept in body => channelId : string ' })
  @ApiResponse({
    description: 'Returns an  array of messages ordered with time',
    type: FETCHMSG,
  })
  @Post('all-msg')
  async ShowAllMsgsOfChannel(
    @Req() req: Request,
    @Body() dto: SHOWCHATDTO,
  ): Promise<FETCHMSG[]> {
    const userid = req.user['id'];
    return await this.fetshchat.ShowAllMsgsOfChannel(userid, dto);
  }

  @ApiOperation({
    summary: 'get all channel with user , accept nothing just send the request',
  })
  @ApiResponse({
    description: 'Returns an  array of channels ordered with time',
    type: [ChannelInfoDTO],
  })
  @Get('all-channel-of-user')
  async ShowAllChannelsOfUser(@Req() req: Request): Promise<ChannelInfoDTO[]> {
    const userID = req.user['id'];
    return await this.fetshchat.ShowAllChannelsOfUser(userID);
  }

  @ApiOperation({
    summary:
      'get all Groups channel with user , accept nothing just send the request',
  })
  @ApiResponse({
    description: 'Returns an  array of all Groups channels ordered with time',
    type: [ChannelGroupInfoDTO],
  })
  @Get('all-group-channel-of-user')
  async ShowGroupChannelsOfUser(
    @Req() req: Request,
  ): Promise<ChannelGroupInfoDTO[]> {
    const userID = req.user['id'];
    return await this.fetshchat.ShowGroupChannelsOfUser(userID);
  }

  @ApiOperation({
    summary:
      'get all Personel channel with user , accept nothing just send the request',
  })
  @ApiResponse({
    description: 'Returns an  array of all Personel channels ordered with time',
    type: [PersonelChannelInfoDTO],
  })
  @Get('all-Personel-channel-of-user')
  async ShowPersonelChannelsOfUser(
    @Req() req: Request,
  ): Promise<PersonelChannelInfoDTO[]> {
    const userID = req.user['id'];
    return await this.fetshchat.ShowPersonelChannelsOfUser(userID);
  }

  // @ApiOperation({
  //   summary: 'get about friend in chat , i wiil implement ranking later',
  // })
  // @ApiResponse({
  //   description: 'Returns an  array of all Personel channels ordered with time',
  //   type: [ABOUTDTO],
  // })
  // @ApiBody({
  //   type: ABOUTREQUESTDTO, // Example class representing the request body
  //   required: true,
  // }) // Add this line
  // @Get('aboutfriend')
  // async AboutFriend(@Body() dto: ABOUTREQUESTDTO): Promise<ABOUTDTO> {
  //   return await this.fetshchat.AboutFriend(dto.friendId);
  // }

  @ApiOperation({
      summary: 'get about friend in chat , i wiil implement ranking later',
    })
    @ApiResponse({
      description: 'Returns an  array of all Personel channels ordered with time',
      type: [ABOUTDTO],
    })
    @ApiParam({
      name: 'friendId',
      description: 'The ID of the friend you want to get information about',
      type: 'number',
      required: true,
    })
    @Get('aboutfriend/:friendId')
    async AboutFriend(@Req() req:Request): Promise<ABOUTDTO> {
      const friendId = Number(req.params['friendId']);
      return await this.fetshchat.AboutFriend(friendId);
    }

}
