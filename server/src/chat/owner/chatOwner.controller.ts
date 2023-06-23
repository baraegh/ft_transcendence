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
@ApiTags('Owner in Group && Admin')
@UseGuards(JwtGuard)
@Controller('chat/setting')
@ApiResponse({ status: 200, description: 'Successful response' })
export class ChaOwnertController {
  constructor(private chatowner: ChatOwnerService) {}


  @ApiOperation({summary:'can owner and admin mut others, but admin cant mute owner'})
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


  @ApiOperation({summary:'can owner and admin remove others , but adim can remove owner'})
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


  @ApiOperation({summary:'Just for owner'})
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

  @ApiOperation({summary:'Just for owner'})
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

  @ApiOperation({summary:'Just for owner'})
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

  @ApiOperation({summary:'Just for owner'})
  @ApiBody({
    type: OWNEREDITDTO,
    required: true,
  })
  @Patch('edit-group')
  async editgroup(@Req() req: Request, @Body() body: OWNEREDITDTO) {
    await this.chatowner.editgroup(req.user['id'], body);
  }
  
}
