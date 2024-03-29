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
import { FriendsService } from 'src/friends/friends.service';
import { ChatService } from '../chat.service';

@Injectable()
export class ChatFriendService {
  constructor(private prisma: PrismaService,private freindservice : FriendsService,private chatserv : ChatService ) {}

  async delet_Chat_With_Frid(UserId: number, dto: CHATFRIENDDTO) {
    const finduser = await this.prisma.user.findUnique({
      where: { id: UserId },
    });
    if (!finduser) throw new ForbiddenException('The user Not Fround');
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelId },
    });

    if (!findChannel) return;
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
        const clearparticipants = await this.prisma.participants.deleteMany({
          where: { channelID: dto.channelId },
        });
        const deletechat = await this.prisma.messages.deleteMany({
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

    let fetchUsers = await this.prisma.friendship.findFirst({
      where: {
        userID: userId,
        friendID: FriendId,
      },
    });

    let seeifimfriendwithit = await this.prisma.friendship.findFirst({
      where: {
        userID:  FriendId,
        friendID: userId,
      },
    });
    if(seeifimfriendwithit)
    {
      await this.prisma.friendship.delete({
        where:{
          id:seeifimfriendwithit.id,
        }
      })
    }
    //
    if (!fetchUsers) {
      fetchUsers = await this.freindservice.sendFriendRequest(FriendId,userId);
      fetchUsers =  await this.prisma.friendship.update({
        where:{
            id:fetchUsers.id,
        },
        data:{
          isRequested:false,
        }
      })
    };

    if (fetchUsers && fetchUsers.blocked === true) return;
    let foundPersonalChannel = await this.prisma.channel.findFirst({
      where: {
        type: 'PERSONEL',
        chanelID: {
          every: {
            OR: [{ userID: userId }, { userID: FriendId }],
          },
        },
      },
    });
    if(!foundPersonalChannel)
    {
      await this.chatserv.joinchatwithFriend(userId, FriendId);
      foundPersonalChannel = await this.prisma.channel.findFirst({
        where: {
          type: 'PERSONEL',
          chanelID: {
            every: {
              OR: [{ userID: userId }, { userID: FriendId }],
            },
          },
        },
      });
    }
    if (foundPersonalChannel) {
      foundPersonalChannel = await this.prisma.channel.update({
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
    const clearparticipants = await this.prisma.participants.update({
      where: { channelID_userID:{
        channelID: foundPersonalChannel.id,
        userID:FriendId,
      }},
      data:{
        blocked:true,
      }
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
    if (fetchUsers && fetchUsers.blocked === false) return;

    const finde_same_channel = await this.prisma.channel.findFirst({
      where: {
        type: 'PERSONEL',
        chanelID: {
          every: {
            OR: [{ userID: userId }, { userID: FriendId }],
          },
        },
      },
      include: {
        messages: true, // Include the messages in the query result
      },
    });
    const messages = finde_same_channel.messages;
    if(finde_same_channel && messages && messages.length == 0)
    {
      await this.prisma.participants.deleteMany({
        where:{
          channelID:finde_same_channel.id,
        }
      })
      await this.prisma.channel.delete({
        where:{
          id: finde_same_channel.id
        }
      })
    }
    else if(finde_same_channel){
      const clearparticipants = await this.prisma.participants.update({
        where: { channelID_userID:{
          channelID: finde_same_channel.id,
          userID:FriendId,
        }},
        data:{
          blocked:false,
        }
      });
        const updatechannel = await this.prisma.channel.update({
          where: { id: finde_same_channel.id },
          data: {
            blocked: false,
            hasblocked: null,
          },
        });
    }
    //
    if(fetchUsers)
    {
      await this.prisma.friendship.delete({
        where: {
          id :fetchUsers.id,
        },
      });
    }
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

    const find_pending = await this.prisma.friendship.findMany({
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

    const pendingFriends: FILTER_USERS_DTO[] = find_pending.map((pending) => ({
      id: pending.friend.id,
      username: pending.friend.username,
      image: pending.friend.image,
    }));

    return pendingFriends;
  }
}