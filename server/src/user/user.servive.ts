import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class USerService {
  constructor(private prisma: PrismaService) {}

async findUserFriends(userId: number): Promise<{ id: number; username: string; image: string }[]> {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        userID: userId,
        isFriend: true,
        requestAccepted: true,
      },
      include: {
        friend: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });
  
    const friends = friendships.map(friendship => friendship.friend);
    return friends;
  }


  
}
