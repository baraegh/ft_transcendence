import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { USerService } from './user.servive';
import { Request } from 'express';
import { USERDTO } from './dto';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtGuard)
@Controller('user')
@ApiResponse({ status: 200, description: 'Successful response' })
export class UserController {
  constructor(private user: USerService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiOperation({
    summary: 'git all friend with usr, just send api i will take it from token',
  })
  @ApiResponse({
    description: 'Returns aray of users ',
    type: USERDTO,
  })
  
  @Get('friends')
  async findUserFriends(@Req() req: Request): Promise<USERDTO[]> {
    const userId = req.user['id'];
    const user = await this.user.findUserFriends(userId);
    return user;
  }
}
