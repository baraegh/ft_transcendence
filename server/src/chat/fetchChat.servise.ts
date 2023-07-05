import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Prisma, Type } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CREATEGROUPSDTO, FETCHMSG } from './dto/msg.dto';
import {
  ABOUTDTO,
  ChannelGroupInfoDTO,
  ChannelInfoDTO,
  PersonelChannelInfoDTO,
  RANKINFIDTO,
  SHOWCHATDTO,
  SHOWGROUPS,
  SHOWUSERS,
  SHOW_MEMBERS_OFGROUP,
} from './dto';


@Injectable()
export class FetchChatService {
  constructor(private prisma: PrismaService) {}

  async ShowAllMsgsOfChannel(userid, dto: SHOWCHATDTO): Promise<FETCHMSG[]> {
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelId },
    });
    if (!findChannel) {
      throw new NotFoundException('channel not found');
    }
    let findinparticepents = await this.prisma.participants.findFirst({
      where: { channelID: dto.channelId, userID: userid },
    });
    if (!findinparticepents) {
      throw new NotFoundException('not found in Participants');
    }

    const currentDate = new Date();

    if (findinparticepents.blocked_at) {
      const diff_on_min = Math.round(
        (currentDate.getTime() - findinparticepents.blocked_at.getTime()) /
          60000,
      );
      if (
        (diff_on_min >= 15 && findinparticepents.mut == 'M15') ||
        (diff_on_min >= 45 && findinparticepents.mut == 'M45') ||
        (diff_on_min >= 480 && findinparticepents.mut == 'M15')
      ) {
        findinparticepents = await this.prisma.participants.update({
          where: {
            channelID_userID: {
              channelID: dto.channelId,
              userID: userid,
            },
          },
          data: {
            mut: 'NAN',
            blocked_at: null,
          },
        });
      }
    }

    if (findinparticepents.mut != 'NAN')
      throw new ForbiddenException('you are muted from this channel');
    if (findinparticepents.blocked === true)
      throw new ForbiddenException('you are blocked');
      const messages = await this.prisma.messages.findMany({
        where: {
          channelID: dto.channelId,
        },
        select: {
          userId: true,
          content: true,
          timeSend: true,
          user: {
            select: {
              image: true,
              username: true,
            },
          },
        },
      });
      const fetchMessages: FETCHMSG[] = messages.map((message) => ({
        userId: message.userId,
        content: message.content,
        timeSend: message.timeSend,
        image: message.user.image,
        username: message.user.username,
      }));
      
      fetchMessages.sort((a, b) => a.timeSend.getTime() - b.timeSend.getTime());
      
      return fetchMessages;
  }

  /******************************************** */
  async ShowAllChannelsOfUser(userId): Promise<ChannelInfoDTO[]> {
    const channelsWithLastMessage = await this.prisma.participants.findMany({
      where: {
        userID: userId,
        channel: {
          type: {
            not: Type.PERSONEL,
          },
        },
      },
      include: {
        channel: {
          include: {
            messages: {
              orderBy: {
                timeSend: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    const channelData = channelsWithLastMessage.map((participant) => {
      const channel = participant.channel;
      const lastMessage = channel?.messages[0];
      return {
        channelId: channel?.id,
        type: channel.type,
        updatedAt: channel.updatedAt,
        channelName: channel?.name,
        channelImage: channel?.image,
        lastMessage: lastMessage
          ? {
              messageId: lastMessage.id,
              content: lastMessage.content,
              timeSent: lastMessage.timeSend,
              senderId: lastMessage.userId,
            }
          : null,
      };
    });

    const channelsWithOtherUser = await this.prisma.participants.findMany({
      where: {
        userID: userId,
        channel: {
          type: Type.PERSONEL,
        },
      },
      include: {
        channel: {
          include: {
            chanelID: {
              select: {
                userID: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    image: true,
                  },
                },
              },
            },
            messages: {
              take: 1,
              orderBy: {
                timeSend: 'desc',
              },
            },
          },
        },
      },
    });

    const PersonelchannelData = channelsWithOtherUser.map((participant) => {
      const channel = participant.channel;
      const otherParticipant = channel.chanelID.find(
        (part) => part.userID !== userId,
      );
      const otherUser = otherParticipant?.user;
      const lastMessage = channel.messages[0];

      return {
        channelId: channel.id,
        type: channel.type,
        updatedAt: channel.updatedAt,
        otherUserId: otherUser?.id,
        otherUserName: otherUser?.username,
        otherUserImage: otherUser?.image,
        lastMessage: lastMessage
          ? {
              messageId: lastMessage.id,
              content: lastMessage.content,
              timeSent: lastMessage.timeSend,
              senderId: lastMessage.userId,
            }
          : null,
      };
    });
    const combinedData = [...channelData, ...PersonelchannelData];

    // Sort the combinedData array by the last message sent and last update
    const sortedData = combinedData.sort((a, b) => {
      const aTime = a.lastMessage
        ? new Date(a.lastMessage.timeSent)
        : new Date(a.updatedAt);
      const bTime = b.lastMessage
        ? new Date(b.lastMessage.timeSent)
        : new Date(b.updatedAt);
      return bTime.getTime() - aTime.getTime();
    });

    return sortedData;
  }

  //***************************************** */
  async ShowGroupChannelsOfUser(userId): Promise<ChannelGroupInfoDTO[]> {
    const channelsWithLastMessage = await this.prisma.participants.findMany({
      where: {
        userID: userId,
        channel: {
          type: {
            not: Type.PERSONEL,
          },
        },
      },
      include: {
        channel: {
          include: {
            messages: {
              orderBy: {
                timeSend: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    const channelData = channelsWithLastMessage.map((participant) => {
      const channel = participant.channel;
      const lastMessage = channel?.messages[0];
      return {
        channelId: channel?.id,
        type: channel.type,
        updatedAt: channel.updatedAt,
        channelName: channel?.name,
        channelImage: channel?.image,
        lastMessage: lastMessage
          ? {
              messageId: lastMessage.id,
              content: lastMessage.content,
              timeSent: lastMessage.timeSend,
              senderId: lastMessage.userId,
            }
          : null,
      };
    });
    return channelData;
  }
  /******************************************** */
  async ShowPersonelChannelsOfUser(userId): Promise<PersonelChannelInfoDTO[]> {
    const channelsWithOtherUser = await this.prisma.participants.findMany({
      where: {
        userID: userId,
        channel: {
          type: Type.PERSONEL,
        },
      },
      include: {
        channel: {
          include: {
            chanelID: {
              select: {
                userID: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    image: true,
                  },
                },
              },
            },
            messages: {
              take: 1,
              orderBy: {
                timeSend: 'desc',
              },
            },
          },
        },
      },
    });

    const PersonelchannelData = channelsWithOtherUser.map((participant) => {
      const channel = participant.channel;
      const otherParticipant = channel.chanelID.find(
        (part) => part.userID !== userId,
      );
      const otherUser = otherParticipant?.user;
      const lastMessage = channel.messages[0];

      return {
        channelId: channel.id,
        type: channel.type,
        updatedAt: channel.updatedAt,
        otherUserId: otherUser.id,
        otherUserName: otherUser.username,
        otherUserImage: otherUser.image,
        lastMessage: lastMessage
          ? {
              messageId: lastMessage.id,
              content: lastMessage.content,
              timeSent: lastMessage.timeSend,
              senderId: lastMessage.userId,
            }
          : null,
      };
    });

    return PersonelchannelData;
  }
  /******************************************** */
  async AboutFriend(friendId: number): Promise<ABOUTDTO> {
    const finduser = await this.prisma.user.findFirst({
      where: { id: friendId },
      select: {
        username: true,
        gameWon: true,
        gameLost: true,
        achievements: true,
        updatedAt: true,
      },
    });
    if (!finduser) {
      throw new NotFoundException('User not found');
    }

    const users = await this.prisma.user.findMany({
      orderBy: [{ gameWon: 'desc' }, { updatedAt: 'asc' }],
      select: {
        id: true,
        username: true,
        image: true,
        gameWon: true,
      },
    });

    const userRanking = users.findIndex((user) => user.id === friendId);
    const leaderboard: RANKINFIDTO[] = users
      .slice(userRanking, userRanking + 6) // Retrieve five more users
      .map((user, index) => ({
        rank: userRanking + index + 1,
        id: user.id,
        image: user.image,
        username: user.username,
        gameWon: user.gameWon,
      }));

    const aboutDto: ABOUTDTO = {
      username: finduser.username,
      gameWon: finduser.gameWon,
      gameLost: finduser.gameLost,
      achievements: finduser.achievements,
      updatedAt: finduser.updatedAt,
      rank: leaderboard,
    };

    return aboutDto;
  }
  /******************************************** */

  async ShowMembersOfGroup(
    userID: number,
    channelId: string,
  ): Promise<SHOW_MEMBERS_OFGROUP> {
    const owner = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        owner: {
          select: {
            username: true,
            image: true,
            id: true,
          },
        },
      },
    });
    if (!owner) {
      throw new NotFoundException('channel not found');
    }
    const findinparticepents = await this.prisma.participants.findFirst({
      where: { channelID: channelId, userID },
    });
    if (!findinparticepents) {
      throw new NotFoundException('not found in Participants');
    }
    const participants = await this.prisma.participants.findMany({
      where: { channelID: channelId },
      include: {
        user: {
          select: {
            username: true,
            image: true,
            id: true,
          },
        },
      },
    });

    const admins = participants
      .filter((participant) => participant.role === 'ADMIN')
      .map(({ user }) => user);

    const users = participants
      .filter(
        (participant) =>
          participant.role === 'USER' && owner.ownerId != participant.userID,
      )
      .map(({ user }) => user);

    return {
      owner: {
        ...owner.owner,
      },
      admins,
      users,
    };
  }



  async roleOfuser(
    userID: number,
    channelId: string,
  ){
    const owner = await this.prisma.participants.findUnique({
      where: { channelID_userID: {
        userID:userID,
        channelID:channelId
      } 
      },
      select: {
        role: true,
        channel: {
          select: {
            ownerId: true,
          },
        },
      },
    });
    if (!owner) {
      throw new NotFoundException('channel not found');
    }
    if(owner.channel.ownerId === userID)
      return "owner"
    else 
    {
    return owner.role;
    }
  }
 /******************************************** */
  async show_users(userId: number): Promise<SHOWUSERS[]> {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) {
      throw new NotFoundException('user not found');
    }

    const fetchUsers = await this.prisma.user.findMany({
      where: {
        NOT: [{ id: userId }, { friendshipUser2: { some: { blocked: true } } }],
      },
      select: {
        id: true,
        username: true,
        image: true,
      },
    });

    return fetchUsers;
  }

  async show_Groups(): Promise<SHOWGROUPS[]> {
    const fetchGroups = await this.prisma.channel.findMany({
      where: {
        NOT: {
          type: {
            in: ['PRIVATE', 'PERSONEL'],
          },
        },
      },
      select: {
        id: true,
        type: true,
        name: true,
        image: true,
      },
    });
    return fetchGroups;
  }
}
