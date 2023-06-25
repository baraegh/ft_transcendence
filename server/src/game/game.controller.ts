import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { CREAT_GAME_DTO, RETURN_OF_CREAT_GAME_DTO } from './game.dto';
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
        status: 200,
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

}
