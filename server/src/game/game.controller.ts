import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { CREAT_GAME_DTO, EDIT_GAME_DTO, END_GAME_DTO, RETURN_OF_CREAT_GAME_DTO } from './game.dto';
import { Request } from 'express';
import { GameService } from './game.service';
import { Match_History } from '@prisma/client';



@ApiBearerAuth()
@ApiTags('Game')
@UseGuards(JwtGuard)
@Controller('game')
export class GameController {
    constructor(private gameServise: GameService){}

    @ApiResponse({
        status: 201,
        description: 'Successfully created game',
        type: RETURN_OF_CREAT_GAME_DTO // Use Match_History as the type here
    })
      @ApiBody({
        type: CREAT_GAME_DTO,
      })
    @Post('create-game')
    async creatGame(@Req() req:Request,@Body() dto:CREAT_GAME_DTO):Promise<Match_History> {
        const userid = req.user['id'];
       return await this.gameServise.creatGame(userid,dto);
    }


    @ApiResponse({
      status: 200,
      type: RETURN_OF_CREAT_GAME_DTO // Use Match_History as the type here
  })
    @ApiBody({
      type: EDIT_GAME_DTO,
    })
    @Patch('edit-match')
    async editMatch(@Req() req:Request, @Body() dto:EDIT_GAME_DTO): Promise<Match_History>{
      return await this.gameServise.editMatch(dto);
    }


    @ApiOperation({
      summary: 'when the game endet , send this to finish the game',
    })
    @ApiResponse({
      type: RETURN_OF_CREAT_GAME_DTO // Use Match_History as the type here
  })
    @ApiBody({
      type: END_GAME_DTO,
    })
    @Patch('end-match')
    async endMatch(@Req() req:Request, @Body() dto:END_GAME_DTO): Promise<Match_History>{
      const userid = req.user['id'];
      return await this.gameServise.endMatch(userid,dto);
    }

    @ApiResponse({type:Boolean , description:""})
    @Get('isplaying')
    async leaderboard(@Req() req:Request) {
      return await this.gameServise.isplaying(req['id']);
    }
}
