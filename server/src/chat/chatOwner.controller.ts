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
  import { OWNERDTO } from './dto/owner.dto';
  import { ChatOwnerService } from './chatOwner.service';

@ApiBearerAuth()
@ApiTags('Owner in Group')
@UseGuards(JwtGuard)
@Controller('chat')
@ApiResponse({ status: 200, description: 'Successful response' })
export class ChaOwnertController {
  constructor(private chatowner: ChatOwnerService) {}


  @ApiOperation({ summary: 'tanden bayna' })
  @ApiBody({
    type: OWNERDTO, // Example class representing the request body
    required: true,
  }) // Add this line
  @HttpCode(HttpStatus.OK)
  @Post('mute-member')
  async muteMember(@Req() req: Request, @Body() body: OWNERDTO) {
    const userID = req.user['id'];
    await this.chatowner.muteMember(userID, body);
  }
}