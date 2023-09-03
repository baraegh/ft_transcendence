import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { USerService } from './user.service';
import { Request } from 'express';
import { USERDTO, USERINFODTO, USER_FRIEN_DTO } from './dto';
import { ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';



@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtGuard)
@Controller('user')
@ApiResponse({ status: 200, description: 'Successful response' })
export class UserController {
  constructor(private user: USerService,private prisma:PrismaService) {}


  @ApiOperation({
    summary: 'git user data',
  })
  @ApiResponse({
    type: USERINFODTO,
  })
  @Get('me')
  getMe(@GetUser() user: any):Promise<USERINFODTO> {
   delete  user.email;
   delete  user.hashedRT;
   delete  user.createdAt;
   delete  user.updatedAt;

    return user;
  }

  @ApiOperation({
    summary: 'git all friend with usr, just send api i will take it from token',
  })
  @ApiResponse({
    description: 'Returns aray of users ',
    type: USER_FRIEN_DTO,
  })
  @Get('friends')
  async findUserFriends(@Req() req: Request): Promise<USER_FRIEN_DTO[]> {
    const userId = req.user['id'];
    const user = await this.user.findUserFriends(userId);
    return user;
  }


  @ApiOperation({
    summary: 'friend with usr',
  })
  @ApiResponse({
    description: 'friend info ',
    type: USER_FRIEN_DTO,
  })
  @ApiParam({
    name: 'friendId',
    type: 'number',
    required: true,
  })
  @Get('my-friends/:friendId')
  async findUsermyFriend(@Req() req: Request,@Param('friendId',ParseIntPipe) friendId: number): Promise<USER_FRIEN_DTO> {
    const userId = req.user['id'];
    const user = await this.user.findMyfriend(userId,friendId);
    return user;
  }
  @ApiOperation({
    summary: 'otheruserId',
  })
  @ApiResponse({
    description: 'true or false',
    type: Boolean,
  })
  @ApiParam({
    name: 'otheruserId',
    type: 'number',
    required: true,
  })
  @Get('isonline/:otheruserId')
  async isonline(@Param('otheruserId',ParseIntPipe) otheruserId: number) {
    const is_online0 = await this.prisma.user.findUnique({
      where:{
        id:otheruserId
      }
    });
    return  is_online0.isonline;
  }


 
  @ApiResponse({
    description: 'true or false',
    type: Boolean,
  })
  @Get('isingame/:otheruserId')
  async isingame(@Req() req: Request) {
    const is_ingame = await this.prisma.user.findUnique({
      where:{
        id:req['id'],
      }
    });
    return  is_ingame.ingame;
  }

  @Get('is_all_online')
  async is_all_online() {
    const is_online0 = await this.prisma.user.findMany({
      where:{
        isonline:true,
      },
      select: {
        id: true,
      },
    });
    const is_online_ids = is_online0.map(user => user.id);

  return is_online_ids;
  }

}
