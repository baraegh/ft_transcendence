import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { USerService } from './user.servive';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags("User")
@UseGuards(JwtGuard)
@Controller('user')
@ApiResponse({ status: 200, description: 'Successful response' })
export class UserController {
  constructor(private user:USerService){}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  @Get('friends')
  async findUserFriends(@Req() req:Request): Promise<{ id: number; username: string; image: string }[]> {
    const userId = req.user['id'];
    const user = await this.user.findUserFriends(userId);
    console.log(user)
    return user
  }
}
