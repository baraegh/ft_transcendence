import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags("User")
@UseGuards(JwtGuard)
@Controller('users')
@ApiResponse({ status: 200, description: 'Successful response' })
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
