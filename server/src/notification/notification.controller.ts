import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ChatFriendService } from 'src/chat/friend/chatFriend.service';
import { FILTER_USERS_DTO } from 'src/chat/friend/chatfried.dto';
import { NotificationService } from './notification.service';
import { FRIEND_REQ } from 'src/friends/dtos';
import { NOTIF_ACCEPT_DTO } from './notif.dto';
import { JwtGuard } from 'src/auth/guard';

@ApiBearerAuth()
@ApiTags('notification')
@UseGuards(JwtGuard)
@Controller('notification')
@Controller('notification')
export class NotificationController {
  constructor(private notif: NotificationService) {}

  @ApiOperation({ summary: 'take nothing' })
  @ApiResponse({ type: FILTER_USERS_DTO })
  @Get('all_friend_req')
  async Friends_Ho_Peding(@Req() req: Request): Promise<FILTER_USERS_DTO[]> {
    return await this.notif.Friends_Ho_Pending(req.user['id']);
  }

  @ApiResponse({
    description: 'info about friend',
    type: NOTIF_ACCEPT_DTO,
  })
  @Patch('accept-friend-request')
  async acceptFriendRequest(
    @Req() req: Request,
    @Body() body: FRIEND_REQ,
  ): Promise<NOTIF_ACCEPT_DTO> {
    const senderId = req.user['id'];
    const receiverId = body.receiverId;
    return await this.notif.acceptFriendRequest(senderId, receiverId);
  }

  @ApiResponse({
    description: 'nothing',
  })
  @Patch('delet-friend-request')
  async deletfriendreq(@Req() req: Request, @Body() body: FRIEND_REQ) {
    const senderId = req.user['id'];
    const receiverId = body.receiverId;
    await this.notif.deletfriendreq(senderId, receiverId);
  }
}
