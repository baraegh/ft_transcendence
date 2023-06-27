import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { LeaderboardService } from './leaderboard.service';
import { LEADERBOURD_DTO } from './leaderboard.dto';

@ApiBearerAuth()
@ApiTags('Leaderboard')
@UseGuards(JwtGuard)
@Controller('leaderboard')
export class LeaderboardController {
    constructor (private leaderboardServise: LeaderboardService){}
  @ApiResponse({type:LEADERBOURD_DTO, isArray: true})
  @Get('leaderboard')
  async leaderboard(@Req() req:Request):Promise<LEADERBOURD_DTO[]> {
    return await this.leaderboardServise.leaderboard()
  }
}
