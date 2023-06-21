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
  import { OWNERCLEARCHATDTO, OWNERDTO, OWNERREMOVEDTO } from '../dto/owner.dto';
  import { ChatOwnerService } from './chatOwner.service';

@ApiBearerAuth()
@ApiTags('Owner in Group')
@UseGuards(JwtGuard)
@Controller('chat')
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
    type: OWNERREMOVEDTO, // Example class representing the request body
    required: true,
  }) // Add this line
  @HttpCode(HttpStatus.OK)
  @Post('remove-member')
  async rmoveMember(@Req() req: Request, @Body() body: OWNERREMOVEDTO) {
    const userID = req.user['id'];
    await this.chatowner.removeMember(userID,body);
  }

  @ApiBody({
    type: OWNERCLEARCHATDTO, // Example class representing the request body
    required: true,
  }) // Add this line
  @HttpCode(HttpStatus.OK)
  @Post('clear-chat')
  async removeMember(@Req() req: Request, @Body() body: OWNERCLEARCHATDTO) {
    const userID = req.user['id'];
    await this.chatowner.clearchat(userID,body)
  }

  @ApiBody({
    type: OWNERCLEARCHATDTO,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Post('delet-group')
  async deletgroup(@Req() req: Request, @Body() body: OWNERCLEARCHATDTO) {
    const userID = req.user['id'];
    await this.chatowner.deletgroup(userID,body)
  }
}