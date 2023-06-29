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
    const finduser = await this.prisma.user.findFirst({
      where: { id: userid },
    });

    if (!finduser) throw new NotFoundException('user not found');
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

  async editMatch(userid: number, dto: EDIT_GAME_DTO): Promise<Match_History> {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userid },
    });
    if (!finduser) throw new NotFoundException('user not found');

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
    const finduser = await this.prisma.user.findFirst({
      where: { id: userid },
    });
    if (!finduser) throw new NotFoundException('user not found');

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
    return editGame;
  }
}
