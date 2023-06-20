import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Prisma, Type } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CREATEGROUPSDTO } from './dto/msg.dto';
import * as argon from 'argon2';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  /*********************************************************/
  async joinchatwithFriend(senderId, receiverId) {

    const existingUser = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });
    console.log('existingUser',existingUser);
    if (!existingUser) {
      throw new ForbiddenException('The Friend Not Exist');
    }
    const finde_same_channel = await this.findPersonalChannelId(senderId, receiverId);
    console.log('finde_same_channel',finde_same_channel);
    if (finde_same_channel) return finde_same_channel;
    const createChanell = await this.prisma.channel.create({
      data: {
        ownerId: null,
      },
    });
    await this.prisma.participants.createMany({
      data: [
        {
          channelID: createChanell.id,
          userID: senderId,
        },
        {
          channelID: createChanell.id,
          userID: receiverId,
        },
      ],
    });
    console.log('createChanell.id',createChanell.id);
    return createChanell.id;
  }

  /*********************************************************/
  async sendMsg(channelID, userId, content) {
    const finduser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!finduser) throw new ForbiddenException('User Not Exist');
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: channelID },
    });
    if (!findChannel) throw new ForbiddenException('Channel Not Exist');

    const find_user_and_channel_in_particepents =
      await this.prisma.participants.findFirst({
        where: { userID: userId, channelID: channelID },
      });

    if (
      find_user_and_channel_in_particepents.blocked ||
      find_user_and_channel_in_particepents.mut != 'NAN'
    )
      throw new ForbiddenException('U Dont have The PermetionTo Send Msg');

    const creatmsg = await this.prisma.messages.create({
      data: {
        channelID,
        userId,
        content,
      },
    });
    if (!creatmsg) {
      throw new ForbiddenException('msg  Not created');
    }
  }

  /*********************************************************/
  async CreateGroup(ownerId, dto: CREATEGROUPSDTO) {
    if(dto.hash){
      const hash = await argon.hash(dto.hash);
      dto.hash = hash;
    }
    const pars = new CREATEGROUPSDTO();
    const existingUser = await this.prisma.user.findUnique({
      where: { id: ownerId },
    });
    if (!existingUser) {
      throw new NotFoundException('The user Not Exist');
    }
    
    try {
      const createChannel = await this.prisma.channel.create({
        data: {
          ownerId: ownerId,
          type: dto.type,
          image: dto.image,
          hash: dto.hash,
          name: dto.name,
        },
      });
      if (
        !Array.isArray(pars.parsedMembers(dto.members)) ||
        !pars.parsedMembers(dto.members).every(Number.isInteger)
      ) {
        throw new BadRequestException(
          'Invalid input: members should be an array of numbers',
        );
      }
      const participantsData: Prisma.ParticipantsCreateManyInput[] = pars
        .parsedMembers(dto.members)
        .map((userId) => ({
          channelID: createChannel.id,
          userID: userId,
        }));
      const partisepents = await this.prisma.participants.createMany({
        data: participantsData,
      });
      if (!partisepents) {
        await this.prisma.channel.delete({
          where: {
            id: createChannel.id,
          },
        });
        throw new NotImplementedException('eroor with participants');
      }
      return createChannel.id;
    } catch (error) {
      throw new NotImplementedException(error);
    }
  }

  ///////////////////////////////////////////////

  async findPersonalChannelId(
    user1Id: number,
    user2Id: number,
  ): Promise<string | null> {
    const personalChannel = await this.prisma.channel.findFirst({
      where: {
        type: 'PERSONEL',
        chanelID: {
          some: {
            userID: {
              in: [user1Id, user2Id],
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!personalChannel) {
      return null;
    }
    return personalChannel.id;
  }
}
