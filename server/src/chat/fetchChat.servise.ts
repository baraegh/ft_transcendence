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
import { ABOUTDTO, ABOUTREQUESTDTO, ChannelGroupInfoDTO, ChannelInfoDTO, PersonelChannelInfoDTO, SHOWCHATDTO } from './dto';
import * as argon from 'argon2';

@Injectable()
export class FetchChatService {
  constructor(private prisma: PrismaService) {}

  async ShowAllMsgsOfChannel(dto: SHOWCHATDTO): Promise<FETCHMSG[]> {
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelId },
    });
    if (!findChannel) {
      throw new NotFoundException('channel not found');
    }
    if(dto.password){
      const rtMatches = await argon.verify(findChannel.hash, dto.password);
      if (!rtMatches) throw new ForbiddenException('Acces Denied');
    }
    const messages = await this.prisma.messages.findMany({
      where: {
        channelID: dto.channelId,
      },
      select: {
        content: true,
        timeSend: true,
      },
    });
    messages.sort((a, b) => a.timeSend.getTime() - b.timeSend.getTime());
    return messages;
  }

  /******************************************** */
  async ShowAllChannelsOfUser(userId): Promise<ChannelInfoDTO[]> {
    const finduser = await this.prisma.user.findFirst({
      where:{id :userId}
    })
    if(!userId){
      throw new NotFoundException('user not found');
    }
    const channelsWithLastMessage = await this.prisma.participants.findMany({
      where: {
        userID: userId,
        channel: {
          type: {
            not: Type.PERSONEL
          }
        }
      },
      include: {
        channel: {
          include: {
            messages: {
              orderBy: {
                timeSend: 'desc'
              },
              take: 1
            }
          }
        }
      }
    });

    const channelData = channelsWithLastMessage.map(participant => {
      const channel = participant.channel;
      const lastMessage = channel?.messages[0];
      return {
        channelId: channel?.id,
        type: channel.type,
        updatedAt:channel.updatedAt,
        channelName: channel?.name,
        channelImage: channel?.image,
        lastMessage: lastMessage ? {
          messageId: lastMessage.id,
          content: lastMessage.content,
          timeSent: lastMessage.timeSend,
          senderId: lastMessage.userId
        } : null
      };
    });

    const channelsWithOtherUser = await this.prisma.participants.findMany({
      where: {
        userID: userId,
        channel: {
          type: Type.PERSONEL
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
        updatedAt:channel.updatedAt,
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
      const aTime = a.lastMessage ? new Date(a.lastMessage.timeSent) : new Date(a.updatedAt);
      const bTime = b.lastMessage ? new Date(b.lastMessage.timeSent) : new Date(b.updatedAt);
      return bTime.getTime() - aTime.getTime();
    });
  
    return sortedData; 
  }

  //***************************************** */
  async ShowGroupChannelsOfUser(userId): Promise<ChannelGroupInfoDTO[]> {
    const finduser = await this.prisma.user.findFirst({
      where:{id :userId}
    })
    if(!userId){
      throw new NotFoundException('user not found');
    }
    const channelsWithLastMessage = await this.prisma.participants.findMany({
      where: {
        userID: userId,
        channel: {
          type: {
            not: Type.PERSONEL
          }
        }
      },
      include: {
        channel: {
          include: {
            messages: {
              orderBy: {
                timeSend: 'desc'
              },
              take: 1
            }
          }
        }
      }
    });

    const channelData = channelsWithLastMessage.map(participant => {
      const channel = participant.channel;
      const lastMessage = channel?.messages[0];
      return {
        channelId: channel?.id,
        type: channel.type,
        updatedAt:channel.updatedAt,
        channelName: channel?.name,
        channelImage: channel?.image,
        lastMessage: lastMessage ? {
          messageId: lastMessage.id,
          content: lastMessage.content,
          timeSent: lastMessage.timeSend,
          senderId: lastMessage.userId
        } : null
      };
    });
    return channelData; 
  }
    /******************************************** */
    async ShowPersonelChannelsOfUser(userId): Promise<PersonelChannelInfoDTO[]> {
      const finduser = await this.prisma.user.findFirst({
        where:{id :userId}
      })
      if(!userId){
        throw new NotFoundException('user not found');
      }
      const channelsWithOtherUser = await this.prisma.participants.findMany({
        where: {
          userID: userId,
          channel: {
            type: Type.PERSONEL
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
          updatedAt:channel.updatedAt,
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
     async AboutFriend(friendId:number): Promise<ABOUTDTO>{
      const finduser = await this.prisma.user.findFirst({
        where: { id: friendId },
        select: {
          username: true, 
          gameWon: true,
          gameLost:true,
          achievements:true,
          updatedAt:true,
        },
      });
      if(!finduser){
        throw new NotFoundException('user not found');
      }
      return finduser;

     }
}
