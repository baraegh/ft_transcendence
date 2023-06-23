import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BLOCK_FRIEND_DTO, CHATFRIENDDTO } from './chatfried.dto';

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
      if (!deletechat) throw new NotFoundException('error on delete');
    }
  }

  async block_user(userId: number, FriendId : number) {
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
    if(fetchUsers.blocked === true)
    throw new NotFoundException('Is blocked');
    await this.prisma.friendship.update({
      where: {
       id:fetchUsers.id,
      },
      data:{
        blocked: true
      }
    })
  }

  async unblock_user(userId: number, FriendId : number) {
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
    if(fetchUsers.blocked === false)
    throw new NotFoundException('Is Unblock');
    await this.prisma.friendship.update({
      where: {
       id:fetchUsers.id,
      },
      data:{
        blocked: false
      }
    })
  }
}
