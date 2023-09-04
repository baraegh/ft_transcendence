import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CREAT_GAME_DTO, EDIT_GAME_DTO, END_GAME_DTO } from './game.dto';
import { Match_History, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async creatGame(userid: number, dto: CREAT_GAME_DTO): Promise<Match_History> {
    const findotheruser = await this.prisma.user.findFirst({
      where: { id: dto.userid },
    });

    if (!findotheruser) throw new NotFoundException('other user not found');

    const creatmatch = await this.prisma.match_History.create({
      data: {
        user1Id: userid,
        user2Id: dto.userid,
        user1P: 0,
        user2P: 0,
      },
    });
    return creatmatch;
  }

  async editMatch( dto: EDIT_GAME_DTO): Promise<Match_History> {
    const findmatch = await this.prisma.match_History.findUnique({
      where: {
        id: dto.GameId,
      },
    });
    if (!findmatch) throw new NotFoundException('Match not found');
    if (findmatch.game_end == true)
      throw new ForbiddenException('Match is end');

    const editGame = await this.prisma.match_History.update({
      where: {
        id: dto.GameId,
      },
      data: {
        user1P: dto.user1P,
        user2P: dto.user2P,
      },
    });
    return editGame;
  }

  async endMatch(userid: number, dto: END_GAME_DTO): Promise<Match_History> {
    const findmatch = await this.prisma.match_History.findUnique({
      where: {
        id: dto.GameId,
      },
    });
    if (!findmatch) throw new NotFoundException('Match not found');
    if (findmatch.game_end == true)
      throw new ForbiddenException('Match is end');

    const editGame = await this.prisma.match_History.update({
      where: {
        id: dto.GameId,
      },
      data: {
        game_end: true,
      },
    });
    let otherplayer: number;
    let userplayer: number;
    let winuser: boolean;
    if (editGame.user1Id === userid) {
      otherplayer = editGame.user2Id;
      userplayer = editGame.user1Id;
    } else {
      otherplayer = editGame.user1Id;
      userplayer = editGame.user2Id;
    }

     
    if (dto.WinnerId && dto.LosserId) {
      await this.prisma.user.update({
        where: { id: dto.WinnerId },
        data: { gameWon: { increment: 1 } },
      });
      await this.prisma.user.update({
        where: { id: dto.LosserId },
        data: { gameLost: { increment: 1 } },
      });
      return editGame;
    }

    if (editGame.user1P > editGame.user2P) winuser = true;
    else winuser = false;
    if(editGame.user1P === editGame.user2P) winuser = null;
    if (winuser === true) {
      await this.prisma.user.update({
        where: { id: userplayer },
        data: { gameWon: { increment: 1 } },
      });
      await this.prisma.user.update({
        where: { id: otherplayer },
        data: { gameLost: { increment: 1 } },
      });
    } else if(winuser === false) {
      await this.prisma.user.update({
        where: { id: userplayer },
        data: { gameLost: { increment: 1 } },
      });
      await this.prisma.user.update({
        where: { id: otherplayer },
        data: { gameWon: { increment: 1 } },
      });
    }
    else if(winuser === null)
    {
      await this.prisma.user.update({
        where: { id: userplayer },
        data: { gameLost: { increment: 1 } },
      });
      await this.prisma.user.update({
        where: { id: otherplayer },
        data: { gameLost: { increment: 1 } },
      });
    }
    return editGame;
  }

  async isplaying(userId:number){
    const matchHistory = await this.prisma.match_History.findMany({
      where: {
        AND: [
          {
            OR: [
              { user1Id: userId },
              { user2Id: userId }
            ]
          },
          { game_end: false }
        ]
      }
    });
    if(matchHistory[0].user1Id == userId || matchHistory[0].user2Id == userId ||matchHistory[1].user1Id == userId || matchHistory[1].user2Id == userId )
      return true;
    else 
    {
      return false;
    }
  }
}
