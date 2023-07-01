import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_FRIEN_DTO } from './dto';

@Injectable()
export class USerService {
  constructor(private prisma: PrismaService) {}

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

  async findMyfriend(
    userId: number,
    friendId: number,
  ): Promise<USER_FRIEN_DTO> {
    const friendships = await this.prisma.friendship.findFirst({
      where: {
        userID: userId,
        friendID: friendId,
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
    if (!friendships)
      throw new BadRequestException('Not friend Or Friend Request Not Send');
    return friendships;
  }
}
