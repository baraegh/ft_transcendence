import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { FRIEND_REQ } from './dtos';
import { FriendsService } from './friends.service';
import { User } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('friends')
@UseGuards(JwtGuard)
@ApiResponse({ status: 200, description: 'Successful response' })
@Controller('friends')
export class FriendsController {
  constructor(private friends: FriendsService) {}
  @ApiResponse({
    description: 'Returns nothing',
  })
  @Post('send-friend-request')
  async sendFriendRequest(@Req() req: Request, @Body() body: FRIEND_REQ) {
    const senderId = req.user['id'];
    const receiverId = body.receiverId;
    await this.friends.sendFriendRequest(senderId, receiverId);
  }

  @ApiResponse({
    description: 'Returns nothing',
  })
  @Patch('accept-friend-request')
  async acceptFriendRequest(@Req() req: Request, @Body() body: FRIEND_REQ) {
    const senderId = req.user['id'];
    const receiverId = body.receiverId;
    await this.friends.acceptFriendRequest(senderId, receiverId);
  }
}
