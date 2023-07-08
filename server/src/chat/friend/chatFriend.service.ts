import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BLOCK_FRIEND_DTO,
  CHATFRIENDDTO,
  FILTER_USERS_DTO,
} from './chatfried.dto';

@Injectable()
export class ChatFriendService {
  constructor(private prisma: PrismaService) {}

  async delet_Chat_With_Frid(UserId: number, dto: CHATFRIENDDTO) {
    const finduser = await this.prisma.user.findUnique({
      where: { id: UserId },
    });
    if (!finduser) throw new ForbiddenException('The user Not Fround');
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelId },
    });

    if (!findChannel) throw new ForbiddenException('The Channel Not Fround');
    if (findChannel.type != 'PERSONEL')
      throw new ForbiddenException('Access Denied');
    else {
      const findInparticipants = await this.prisma.participants.findUnique({
        where: {
          channelID_userID: {
            channelID: dto.channelId,
            userID: UserId,
          },
        },
      });
      if (!findInparticipants)
        throw new NotFoundException('Your Not Exist in This Channel');
      const deletechat = await this.prisma.messages.deleteMany({
        where: { channelID: dto.channelId },
      });
      const removechannel = await this.prisma.channel.delete({
        where:{}
      })

      const clearparticipants = await this.prisma.participants.deleteMany({
        where: { channelID: dto.channelId },
      });

      const deletGroup = await this.prisma.channel.delete({
        where: { id: dto.channelId },
      });
    }
  }

  async block_user(userId: number, FriendId: number) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) {
      throw new NotFoundException('user not found');
    }

    const findOtheruser = await this.prisma.user.findUnique({
      where: { id: FriendId },
    });
    if (!findOtheruser) {
      throw new NotFoundException('user not found');
    }

    const fetchUsers = await this.prisma.friendship.findFirst({
      where: {
        userID: userId,
        friendID: FriendId,
      },
    });
    if (!fetchUsers) throw new NotFoundException('Not Your Friend');
    if (fetchUsers.blocked === true) throw new NotFoundException('Is blocked');
    const foundPersonalChannel = await this.prisma.channel.findFirst({
      where: {
        type: 'PERSONEL',
        chanelID: {
          every: {
            OR: [{ userID: userId }, { userID: FriendId }],
          },
        },
      },
    });

    if (foundPersonalChannel) {
       await this.prisma.channel.update({
        where: { id: foundPersonalChannel.id },
        data: {
          blocked: true,
          hasblocked: userId,
        },
      });
    }
    await this.prisma.friendship.update({
      where: {
        id: fetchUsers.id,
      },
      data: {
        blocked: true,
      },
    });
  }

  async unblock_user(userId: number, FriendId: number) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) {
      throw new NotFoundException('user not found');
    }

    const findOtheruser = await this.prisma.user.findUnique({
      where: { id: FriendId },
    });
    if (!findOtheruser) {
      throw new NotFoundException('user not found');
    }

    const fetchUsers = await this.prisma.friendship.findFirst({
      where: {
        userID: userId,
        friendID: FriendId,
      },
    });
    if (!fetchUsers) throw new NotFoundException('Not Your Friend');
    if (fetchUsers.blocked === false) throw new NotFoundException('Is Unblock');
    await this.prisma.friendship.update({
      where: {
        id: fetchUsers.id,
      },
      data: {
        blocked: false,
      },
    });
  }

  async Friends_Ho_Blocked(userId: number): Promise<FILTER_USERS_DTO[]> {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) {
      throw new NotFoundException('user not found');
    }

    const find_blocker = await this.prisma.friendship.findMany({
      where: {
        userID: userId,
        blocked: true,
      },
      select: {
        friend: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    const blockedFriends: FILTER_USERS_DTO[] = find_blocker.map((blocker) => ({
      id: blocker.friend.id,
      username: blocker.friend.username,
      image: blocker.friend.image,
    }));

    return blockedFriends;
  }

  async Friends_Ho_Pending(userId: number): Promise<FILTER_USERS_DTO[]> {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) {
      throw new NotFoundException('user not found');
    }

    const find_blocker = await this.prisma.friendship.findMany({
      where: {
        userID: userId,
        isRequested: true,
      },
      select: {
        friend: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    const blockedFriends: FILTER_USERS_DTO[] = find_blocker.map((blocker) => ({
      id: blocker.friend.id,
      username: blocker.friend.username,
      image: blocker.friend.image,
    }));

    return blockedFriends;
  }
}
