import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LEADERBOURD_DTO } from './leaderboard.dto';

@Injectable()
export class LeaderboardService {
    constructor(private prisma:PrismaService){}
  async leaderboard():Promise<LEADERBOURD_DTO[]> {
    
    const users = await this.prisma.user.findMany({
        orderBy: [
          { gameWon: 'desc' },
          { updatedAt: 'asc' },
        ],
        select: {
          id: true,
          username: true,
          image: true,
          gameWon: true,
        },
      });
    
      const leaderboard: LEADERBOURD_DTO[] = users.map((user, index) => ({
        rank: index + 1,
        score: user.gameWon * 10,
        id: user.id,
        image: user.image,
        username: user.username,
        gameWon: user.gameWon,
      }));
      return leaderboard;
  }
}
