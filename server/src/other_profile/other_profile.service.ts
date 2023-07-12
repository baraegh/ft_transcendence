import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  MATCH_HISTORY_DTO,
  SELECTE_DATA_OF_OTHER_PLAYER,
} from 'src/profile/profile.dto';
import { USER_FRIEN_DTO } from 'src/user/dto';
import { ABOUOTHERTDTO, Friend } from './otheruserID.dto';

@Injectable()
export class OtherProfileService {
  constructor(private prisma: PrismaService) {}

  async matchHistory(userId: number): Promise<MATCH_HISTORY_DTO[]> {
    const finduser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!finduser) throw new ForbiddenException('Other user Not Found');
    const matchHistory = await this.prisma.match_History.findMany({
      where: {
        OR: [
          {
            user1Id: userId,
          },
          {
            user2Id: userId,
          },
        ],
      },
      select: {
        id: true,
        user1Id: true,
        user2Id: true,
        user1P: true,
        user2P: true,
        user1: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
        user2: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
      },
    });

    const matchHistoryDTOs = matchHistory.map((match) => {
      let otherUser: SELECTE_DATA_OF_OTHER_PLAYER;
      let win: boolean;
      if (match.user1Id === userId) {
        otherUser = match.user2;
      } else {
        otherUser = match.user1;
        const temp = match.user1P;
        match.user1P = match.user2P;
        match.user2P = temp;
      }
      if (match.user1P >= match.user2P) win = true;
      else win = false;
      return {
        matchId: match.id,
        otherUser,
        win: win,
        user1P: match.user1P,
        user2P: match.user2P,
      };
    });

    return matchHistoryDTOs;
  }

  async findUserFriends(userId: number): Promise<USER_FRIEN_DTO[]> {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        userID: userId,
        isFriend: true,
        requestAccepted: true,
      },
      select: {
        blocked: true,
        isRequested: true,
        isFriend: true,
        requestAccepted: true,
        friend: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });
    return friendships;
  }

  async Aboutouther(userId: number, otherId: number): Promise<ABOUOTHERTDTO> {
    const findOther = await this.prisma.user.findUnique({
      where: {
        id: otherId,
      },
    });

    if (!findOther) {
      throw new ForbiddenException('Other user not found');
    }

    const friendships = await this.prisma.friendship.findFirst({
      where: {
        userID: otherId,
        friendID: userId,
      },
      select: {
        user:true,
        blocked: true,
        isRequested: true,
        isFriend: true,
        requestAccepted: true,
        },
      });
      const foundPersonalChannel = await this.prisma.channel.findFirst({
        where: {
          type: 'PERSONEL',
          chanelID: {
            every: {
              OR: [{ userID: userId }, { userID: otherId }],
            },
          },
        },
      });

    const aboutOther: ABOUOTHERTDTO = {
      id: findOther.id,
      username: findOther.username,
      image:findOther.image,
      gameWon: findOther.gameWon,
      gameLost: findOther.gameLost,
      achievements: findOther.achievements,
      updatedAt: findOther.updatedAt,
      blocked: foundPersonalChannel?.blocked || false,
      hosblocked: foundPersonalChannel?.hasblocked || null,
      isRequested: friendships?.isRequested || false,
      isFriend: friendships?.isFriend || false,
      requestAccepted: friendships?.requestAccepted || false,
    };
    return aboutOther;
  }
}
