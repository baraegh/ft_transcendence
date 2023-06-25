import { Injectable, NotFoundException } from '@nestjs/common';
import { CREAT_GAME_DTO } from './game.dto';
import { Match_History, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async creatGame(userid: number, dto: CREAT_GAME_DTO):Promise<Match_History> {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userid },
    });

    if (!finduser) throw new NotFoundException('user not found');
    const findotheruser = await this.prisma.user.findFirst({
      where: { id: dto.userid },
    });

    if (!findotheruser) throw new NotFoundException('other user not found');

    const creatmatch = await this.prisma.match_History.create({
        data:{
            user1Id:userid,
            user2Id:dto.userid,
            user1P:0,
            user2P:0,
        }
    })
    return creatmatch;
  }
}
