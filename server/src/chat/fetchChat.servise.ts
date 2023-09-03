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
  GROUP_INFO_DTO,
  IS_BLOCKED_DTO,
  LEAVEGROUPDTO,
  PersonelChannelInfoDTO,
  RANKINFIDTO,
  SHOWCHATDTO,
  SHOWGROUPS,
  SHOWUSERS,
  SHOW_MEMBERS_OFGROUP,
} from './dto';
import { ChatOwnerService } from './owner/chatOwner.service';


@Injectable()
export class FetchChatService {
  constructor(private prisma: PrismaService,private chatowner: ChatOwnerService) {}

  async ShowAllMsgsOfChannel(userid, dto: SHOWCHATDTO): Promise<FETCHMSG[]> {
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelId },
    });
    if (!findChannel) {
      return;
    }
    let findinparticepents = await this.prisma.participants.findFirst({
      where: { channelID: dto.channelId, userID: userid },
    });
    if (!findinparticepents) {
      return
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
      return;
    if (findinparticepents.blocked === true)
       return;

       const messages = await this.prisma.messages.findMany({
        where: {
          channelID: dto.channelId,
          NOT: {
            user: {
              OR: [
                {
                  friendshipUser2: {
                    some: {
                      AND: [
                        { blocked: true },
                        { user: { id: userid } }
                      ]
                    }
                  }
                },
                {
                  friendshipUser1: {
                    some: {
                      AND: [
                        { blocked: true },
                        { friend: { id: userid } }
                      ]
                    }
                  }
                }
              ]
            }
          }
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
        blocked:channel.blocked,
        hasblocked:channel.hasblocked,
        mut:participant.mut,
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
        blocked:channel.blocked,
        hasblocked:channel.hasblocked,
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
        mut:participant.mut,
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
        blocked:channel.blocked,
        hasblocked:channel.hasblocked,
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
      return;
    }
    let findinparticepents = await this.prisma.participants.findFirst({
      where: { channelID: channelId, userID },
    });
    if (!findinparticepents) {
       findinparticepents = await this.prisma.participants.findFirst({
        where: { channelID: channelId},
      });
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
      return;
    }
    if(owner.channel.ownerId === userID)
      return "owner"
    else 
    {
    return owner.role;
    }
  }


    async infoOfgroup(
    channelId: string,
  ):Promise<GROUP_INFO_DTO>{
    const owner = await this.prisma.channel.findUnique({
      where: {  
        id:channelId,
      },
      select: {
        type: true,
        name:true,
        image:true,
      },
    });
    if (!owner) {
      return;
    }
   return owner
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
    NOT: [
      {
        id: userId
      },
      {
        OR: [
          {
            friendshipUser2: {
              some: {
                AND: [
                  { blocked: true },
                  { user: { id: userId } }
                ]
              }
            }
          },
          {
            friendshipUser1: {
              some: {
                AND: [
                  { blocked: true },
                  { friend: { id: userId } }
                ]
              }
            }
          },
        ]
      }
    ]
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

  async leave_group(userId: number, dto: LEAVEGROUPDTO) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) throw new NotFoundException('user not found');
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelid },
      include: {
        chanelID: {
          select: {
            role: true,
          },
        },
      },
    });
    if (!findChannel) return;
    if(findChannel.type == "PERSONEL")
      throw new ForbiddenException('Ths channel is private');
    if (findChannel.ownerId === userId)
    {
      await this.chatowner.deletgroup(userId, dto);
      return ;
    }
    const participantUniqueInput: Prisma.ParticipantsWhereUniqueInput = {
      channelID_userID: {
        channelID: dto.channelid,
        userID: userId,
      },
    };
    const updateParticipant = await this.prisma.participants.delete({
      where: participantUniqueInput,
    });
    if (!updateParticipant) throw new NotFoundException('Entity not found');
  }

  async isBlocked(userid:number,dto:IS_BLOCKED_DTO)
  {
    let findparticipants = await this.prisma.participants.findUnique({
      where: { channelID_userID:{
        channelID:dto.channelId,
        userID:userid
      } },
    });
    const currentDate = new Date();
    if (findparticipants?.blocked_at) {
      const diff_on_min = Math.round(
        (currentDate.getTime() - findparticipants.blocked_at.getTime()) /
          60000,
      );
      if (
        (diff_on_min >= 15 && findparticipants.mut == 'M15') ||
        (diff_on_min >= 45 && findparticipants.mut == 'M45') ||
        (diff_on_min >= 480 && findparticipants.mut == 'M15')
      ) {
        findparticipants = await this.prisma.participants.update({
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
    if(findparticipants?.mut === 'NAN')
    {
      return false;
    }
    return true;
  }

}



