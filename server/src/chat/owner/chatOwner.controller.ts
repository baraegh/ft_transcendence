import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
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
import {
  OWNEADDADMINRDTO,
  CHANNELIDDTO,
  OWNERDTO,
  OWNEREDITDTO,
  OWNERPROPDTO,
} from '../dto/owner.dto';
import { ChatOwnerService } from './chatOwner.service';

@ApiBearerAuth()
@ApiTags('Owner in Group')
@UseGuards(JwtGuard)
@Controller('chat/setting')
@ApiResponse({ status: 200, description: 'Successful response' })
export class ChaOwnertController {
  constructor(private chatowner: ChatOwnerService) {}

  @ApiBody({
    type: OWNERDTO, // Example class representing the request body
    required: true,
  }) // Add this line
  @HttpCode(HttpStatus.OK)
  @Patch('mute-member')
  async muteMember(@Req() req: Request, @Body() body: OWNERDTO) {
    const userID = req.user['id'];
    await this.chatowner.muteMember(userID, body);
  }

  @ApiBody({
    type: OWNERPROPDTO, // Example class representing the request body
    required: true,
  }) // Add this line
  @HttpCode(HttpStatus.OK)
  @Post('remove-member')
  async rmoveMember(@Req() req: Request, @Body() body: OWNERPROPDTO) {
    const userID = req.user['id'];
    await this.chatowner.removeMember(userID, body);
  }

  @ApiBody({
    type: CHANNELIDDTO, // Example class representing the request body
    required: true,
  }) // Add this line
  @HttpCode(HttpStatus.OK)
  @Post('clear-chat')
  async removeMember(@Req() req: Request, @Body() body: CHANNELIDDTO) {
    const userID = req.user['id'];
    await this.chatowner.clearchat(userID, body);
  }

  @ApiBody({
    type: CHANNELIDDTO,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('delet-group')
  async deletgroup(@Req() req: Request, @Body() body: CHANNELIDDTO) {
    const userID = req.user['id'];
    await this.chatowner.deletgroup(userID, body);
  }

  @ApiBody({
    type: OWNEADDADMINRDTO,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('add-admin')
  async addAdmin(@Req() req: Request, @Body() body: OWNEADDADMINRDTO) {
    const userID = req.user['id'];
    await this.chatowner.addAdmin(userID, body);
  }

  // @ApiBody({
  //   type: OWNERPROPDTO,
  //   required: true,
  // })
  // @HttpCode(HttpStatus.OK)
  // @Post('add-user')
  // async inviteuser(@Req() req: Request, @Body() body: OWNERPROPDTO) {
  //   const userID = req.user['id'];
  //   await this.chatowner.inviteuser(userID, body);
  // }

  @ApiBody({
    type: OWNEREDITDTO,
    required: true,
  })
  @Patch('edit-group')
  async editgroup(@Req() req: Request, @Body() body: OWNEREDITDTO) {
    await this.chatowner.editgroup(req.user['id'], body);
  }
  
}
