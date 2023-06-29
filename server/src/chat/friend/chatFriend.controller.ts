import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { ChatFriendService } from './chatFriend.service';
import { Request } from 'express';
import { BLOCK_FRIEND_DTO, CHATFRIENDDTO, FILTER_USERS_DTO } from './chatfried.dto';
import { type } from 'os';

@ApiBearerAuth()
@ApiTags('chat With Friend')
@UseGuards(JwtGuard)
@Controller('chat/friend')
@ApiResponse({ status: 200, description: 'Successful response' })
export class ChaFriendController {
  constructor(private chatfriend: ChatFriendService) {}

  @ApiBody({
    type: CHATFRIENDDTO, 
    required: true,
  }) // Ad
  @ApiOperation({summary:"delet chat only  with friend"}
  )
  @Post('delet-chat')
  async delet_Chat_With_Frid(@Req() req: Request,@Body() dto: CHATFRIENDDTO) {
    await this.chatfriend.delet_Chat_With_Frid(req.user['id'], dto);
  }

  @ApiBody({
    type: BLOCK_FRIEND_DTO, 
    required: true,
  }) 
  @Patch('block_friend')
  async block_user(@Req() req: Request, @Body() dto: BLOCK_FRIEND_DTO) {
    await this.chatfriend.block_user(req.user['id'],dto.FriendId);
  }

  @ApiBody({
    type: BLOCK_FRIEND_DTO, 
    required: true,
  }) 
  @Patch('unblock_friend')
  async unblock_user(@Req() req: Request, @Body() dto: BLOCK_FRIEND_DTO) {
    await this.chatfriend.unblock_user(req.user['id'],dto.FriendId);
  }

  @ApiOperation({summary:"take nothing"})
  @ApiResponse({type:FILTER_USERS_DTO})
  @Get('filter/block')
  async Friends_Ho_Blocked(@Req() req:Request):Promise<FILTER_USERS_DTO[]>{
      return await this.chatfriend.Friends_Ho_Blocked(req.user['id'])
  }

  @ApiOperation({summary:"take nothing"})
  @ApiResponse({type:FILTER_USERS_DTO})
  @Get('filter/pending')
  async Friends_Ho_Peding(@Req() req:Request):Promise<FILTER_USERS_DTO[]>{
      return await this.chatfriend.Friends_Ho_Pending(req.user['id'])
  }
}
