import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_FRIEN_DTO } from './dto';

@Injectable()
export class USerService {
  constructor(private prisma: PrismaService) {}

async findUserFriends(userId: number): Promise<USER_FRIEN_DTO[]> {
  const finduser = await this.prisma.user.findFirst({
    where: { id: userId },
  });
  if (!finduser) {
    throw new NotFoundException('user not found');
  }
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
    // const friends = friendships.map(friendship => friendship.friend);
    return friendships;
  }


  
}
