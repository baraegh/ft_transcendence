import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { OtherProfileService } from './other_profile.service';
import { MATCH_HISTORY_DTO } from 'src/profile/profile.dto';
import { USER_FRIEN_DTO } from 'src/user/dto';
import { ABOUOTHERTDTO } from './otheruserID.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('other-profile')
@UseGuards(JwtGuard)
@Controller('other-profile')
export class OtherProfileController {
    constructor(private Oprofile: OtherProfileService) {}


    @ApiOperation({
        summary: 'get all match history of other user ',
      })
      @ApiParam({
        name: 'otheruserID',
        type: 'number',
        required: true,
      })
    @ApiResponse({
        type:MATCH_HISTORY_DTO
      })
      @Get("match-history/:otheruserID")
      async matchHistory(@Param("otheruserID",ParseIntPipe ) otheruserID:number):Promise<MATCH_HISTORY_DTO[]>{
        return await this.Oprofile.matchHistory(otheruserID);
      }

      @ApiOperation({
        summary: 'git all friend of other user',
      })
      @ApiResponse({
        description: 'Returns aray of users ',
        type: USER_FRIEN_DTO,
      })
      @ApiParam({
        name: 'otheruserID',
        type: 'number',
        required: true,
      })
      @Get('friends/:otheruserID')
      async findUserFriends(@Param("otheruserID",ParseIntPipe ) otheruserID:number): Promise<USER_FRIEN_DTO[]> {
        const user = await this.Oprofile.findUserFriends(otheruserID);
        return user;
      }


      @ApiOperation({
        summary: 'get about otheruserID ',
      })
      @ApiResponse({
        status: 200,
        description: 'OK',
        type: [ABOUOTHERTDTO],
      })
      @ApiParam({
        name: 'otheruserID',
        description: 'The ID of the other user you want to get information about',
        type: 'number',
        required: true,
      })
      @Get('about/:otheruserID')
      async Aboutouther(@Req() req:Request,@Param("otheruserID",ParseIntPipe ) otheruserID:number): Promise<ABOUOTHERTDTO> {
        return await this.Oprofile.Aboutouther(req.user['id'],otheruserID);
      }

}
