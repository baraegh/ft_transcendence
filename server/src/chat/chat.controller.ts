import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
  INVETUSERDTO,
  JOINGROUPDTO,
  JOINGROUPRTURNDTO,
  MSGDTO,
  PersonelChannelInfoDTO,
  RANKINFIDTO,
  RETUR_OF_CHANNEL_DTO,
  SHOWCHATDTO,
  SHOWGROUPS,
  SHOWUSERS,
  SHOW_MEMBERS_OFGROUP,
} from './dto';
import { HttpStatusCode } from 'axios';
import { FetchChatService } from './fetchChat.servise';
import { OWNERDTO } from './dto/owner.dto';
import { ChatOwnerService } from './owner/chatOwner.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiBearerAuth()
@ApiTags('chat')
@UseGuards(JwtGuard)
@Controller('chat')
@ApiResponse({ status: 200, description: 'Successful response' })
export class ChatController {
  constructor(
    private chat: ChatService,
    private fetshchat: FetchChatService,
    private prisma: PrismaService,
  ) {}

  @ApiOperation({ summary: 'make channel with friend if not exist' })
  @ApiResponse({
    description:
      'Returns id of channel string like: 794c9ac3-fa09-4a2d-9d7e-0dd2a531624e',
    type: FRIEND_REQ,
  })
  @HttpCode(HttpStatus.OK)
  @Post('join-friend')
  async joinchat(@Req() req: Request, @Body() body: FRIEND_REQ) {
    const senderId = req.user['id'];
    const receiverId = body.receiverId;
    return await this.chat.joinchatwithFriend(senderId, receiverId);
  }

  @ApiOperation({ summary: 'when user wanna join to group' })
  @ApiResponse({
    type: [JOINGROUPRTURNDTO],
  })
  @HttpCode(HttpStatus.OK)
  @Post('join-group')
  async joingroup(
    @Req() req: Request,
    @Body() body: JOINGROUPDTO,
  ): Promise<JOINGROUPRTURNDTO> {
    const userid = req.user['id'];
    return await this.chat.joingroup(userid, body);
  }

  @ApiOperation({ summary: 'when other admin or owner add member' })
  @ApiResponse({
    type: [JOINGROUPRTURNDTO],
  })
  @HttpCode(HttpStatus.OK)
  @Post('invite-user')
  async invitegroup(
    @Req() req: Request,
    @Body() body: INVETUSERDTO,
  ): Promise<JOINGROUPRTURNDTO> {
    const userid = req.user['id'];
    return await this.chat.invite_user(userid, body);
  }

  @ApiBody({
    type: MSGDTO,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('send-msg')
  async SendMsg(@Req() req: Request, @Body() body: MSGDTO) {
    const senderId = req.user['id'];
    const channelId = body.channelID;
    const content = body.content;
    await this.chat.sendMsg(channelId, senderId, content);
  }

  @ApiBody({
    type: CREATEGROUPSDTO,
    required: true,
  })
  @ApiResponse({
    description: 'Returns id of channel ',
    type: RETUR_OF_CHANNEL_DTO,
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post('create-group')
  async CreateGroup(
    @Req() req: Request,
    @Body() body: CREATEGROUPSDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<RETUR_OF_CHANNEL_DTO> {
    const ownerId = req.user['id'];
    const localhostUrl = `${req.protocol}://${req.get('host')}`;
    return await this.chat.CreateGroup(ownerId, body, file, localhostUrl);
  }

  @ApiParam({
    name: 'name',
    description: 'the name of group is unique or not',
    type: 'string',
    required: true,
  })
  @ApiResponse({
    description: 'true or false',
  })
  @Get('NameGroupExist/:name')
  async NameGroupExist(@Param('name') name: string) {
    const findenameunique = await this.prisma.channel.findUnique({
      where: {
        name: name,
      },
    });
    if (findenameunique) return true;
    else return false;
  }

  @ApiOperation({ summary: 'get msg  ' })
  @ApiResponse({
    description: 'Returns an  array of messages ordered with time',
    type: FETCHMSG,
  })
  @ApiBody({
    type: SHOWCHATDTO,
    required: true,
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

  @ApiOperation({
    summary: 'get about friend in chat , ranking start with friend rank nd 5 more **** add ranking',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: [ABOUTDTO],
  })
  @ApiParam({
    name: 'friendId',
    description: 'The ID of the friend you want to get information about',
    type: 'number',
    required: true,
  })
  @Get('aboutfriend/:friendId')
  async AboutFriend(@Req() req: Request): Promise<ABOUTDTO> {
    const friendId = Number(req.params['friendId']);
    return await this.fetshchat.AboutFriend(friendId);
  }

  @ApiOperation({
    summary: 'get all group members',
  })
  @ApiResponse({
    description: 'Returns an  array of all Members : owner,admin,user',
    type: [SHOW_MEMBERS_OFGROUP],
  })
  @ApiParam({
    name: 'channelId',
    description: 'The ID of the channel you want to get information about',
    type: 'string',
    required: true,
  })
  @Get('show-members/:channelId')
  async ShowMembersOfGroup(@Req() req: Request): Promise<SHOW_MEMBERS_OFGROUP> {
    const channelId = String(req.params['channelId']);
    const userID = req.user['id'];
    return await this.fetshchat.ShowMembersOfGroup(userID, channelId);
  }


  @ApiOperation({
    summary: 'get all group members',
  })
  @ApiResponse({
    description: 'Returns an  role : owner,admin,user',
    type: [SHOW_MEMBERS_OFGROUP],
  })
  @ApiParam({
    name: 'channelId',
    description: 'The ID of the channel you want to get information about',
    type: 'string',
    required: true,
  })
  @Get('roleOfuser/:channelId')
  async roleOfuser(@Req() req: Request) {
    const channelId = String(req.params['channelId']);
    const userID = req.user['id'];
    return await this.fetshchat.roleOfuser(userID, channelId);
  }

  @ApiOperation({
    summary: 'get all Users except blocked',
  })
  @ApiResponse({
    description: 'Returns an  array of all users',
    type: [SHOWUSERS],
  })
  @Get('show-all-users')
  async show_users(@Req() req: Request): Promise<SHOWUSERS[]> {
    return await this.fetshchat.show_users(req.user['id']);
  }

  @ApiOperation({
    summary: 'get all Groups except Personnel And Private',
  })
  @ApiResponse({
    description: 'Returns an  array of all Grops',
    type: [SHOWGROUPS],
  })
  @Get('show-all-groups')
  async show_Groups(): Promise<SHOWGROUPS[]> {
    return await this.fetshchat.show_Groups();
  }
}
