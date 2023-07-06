import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Prisma, Type } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CREATEGROUPSDTO } from './dto/msg.dto';
import * as argon from 'argon2';
import { CHANNELIDDTO } from './dto/owner.dto';
import { INVETUSERDTO, JOINGROUPDTO, JOINGROUPRTURNDTO, RETUR_OF_CHANNEL_DTO } from './dto';
import { createWriteStream } from 'fs';
import * as path from 'path';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  /*********************************************************/
  async joinchatwithFriend(senderId, receiverId) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });
    console.log('existingUser', existingUser);
    if (!existingUser) {
      throw new ForbiddenException('The Friend Not Exist');
    }
    const finde_same_channel = await this.findPersonalChannelId(
      senderId,
      receiverId,
    );
    console.log('finde_same_channel', finde_same_channel);
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
    return createChanell.id;
  }

  /*********************************************************/
  async joingroup(
    userId: number,
    dto: JOINGROUPDTO,
  ): Promise<JOINGROUPRTURNDTO> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new ForbiddenException('The User Not Exist');
    }

    const existingChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelId },
      select: {
        id: true,
        type: true,
        name: true,
        image: true,
        hash: true,
      },
    });
    if (!existingChannel) {
      throw new ForbiddenException('The Channel Not Exist');
    }
    const existingmumber: Prisma.ParticipantsWhereUniqueInput = {
      channelID_userID: {
        channelID: dto.channelId,
        userID: userId,
      },
    };
    if (existingmumber) {
      throw new ForbiddenException('The user already member');
    }

    if (existingChannel.type === 'PROTECTED' && !dto.password)
      throw new ForbiddenException('Password Must be');
    else if (existingChannel.type === 'PROTECTED' && dto.password) {
      const PMatch = argon.verify(existingChannel.hash, dto.password);
      if (!PMatch) {
        throw new ForbiddenException('Password not correct');
      }
    }

    delete existingChannel.hash;
    await this.prisma.participants.create({
      data: {
        channelID: dto.channelId,
        userID: userId,
      },
    });
    return existingChannel;
  }

  /*********************************************************/
  async invite_user(
    userId: number,
    dto: INVETUSERDTO,
  ): Promise<JOINGROUPRTURNDTO> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new ForbiddenException('The User Not Exist');
    }

    const otherusers = await this.prisma.user.findMany({
      where: { id: { in: dto.otheruserid } },
    });
    if(dto.otheruserid.length == 0)
      throw new BadRequestException('select users');
      
    if (otherusers.length !== dto.otheruserid.length) {
      throw new NotFoundException('som users not in server');
    }
    if (!otherusers) {
      throw new ForbiddenException('The other user Not Exist');
    }

    const existingChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelId },
      select: {
        id: true,
        type: true,
        name: true,
        image: true,
        ownerId: true,
        chanelID: {
          select: {
            role: true,
          },
        },
      },
    });
    if (!existingChannel) {
      throw new ForbiddenException('The Channel Not Exist');
    }

    if (existingChannel.type === 'PERSONEL')
      throw new ForbiddenException('Forbiden acces');

    if (
      existingChannel.ownerId === userId ||
      existingChannel.chanelID['role'] === 'ADMIN'
    ) {
      

      const participants = await this.prisma.participants.findMany({
        where: {
          channelID: dto.channelId,
          userID: { in: dto.otheruserid },
        },
        select: {
          userID: true,
        },
      });
    
      const existingUserIds = participants.map((participant) => participant.userID);
    
      const newUsers = dto.otheruserid.filter((userId) => !existingUserIds.includes(userId));
    
  if (newUsers.length > 0) {
    const participantsToCreate: Prisma.ParticipantsCreateManyInput[] = newUsers.map((userId) => ({
      channelID: dto.channelId,
      userID: userId,
    }));

    await this.prisma.participants.createMany({
      data: participantsToCreate,
    });
  }
      delete existingChannel.chanelID;
      delete existingChannel.ownerId;
      return existingChannel;
    } else {
      throw new ForbiddenException('Forbiden acces');
    }
  }

  /*********************************************************/
  async sendMsg(channelID, userId, content) {
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: channelID },
    });
    if (!findChannel) throw new ForbiddenException('Channel Not Exist');

    let find_user_and_channel_in_particepents =
      await this.prisma.participants.findFirst({
        where: { userID: userId, channelID: channelID },
      });

      const currentDate = new Date();
    
      if (find_user_and_channel_in_particepents.blocked_at ){
        const diff_on_min = Math.round(
          ( currentDate.getTime() - find_user_and_channel_in_particepents.blocked_at.getTime())/60000,
          );
        if ((diff_on_min >= 15 && find_user_and_channel_in_particepents.mut == 'M15') ||
        (diff_on_min >= 45 && find_user_and_channel_in_particepents.mut == 'M45') ||
        (diff_on_min >= 480 && find_user_and_channel_in_particepents.mut == 'M15')) {
          find_user_and_channel_in_particepents = await this.prisma.participants.update({
            where: {
              channelID_userID: {
                channelID: channelID,
                userID: userId,
              },
            },
            data: {
              mut: 'NAN',
              blocked_at:null
            },
          });
        } 
      }
    if (
      find_user_and_channel_in_particepents.blocked ||
      find_user_and_channel_in_particepents.mut != 'NAN'
    )
      throw new ForbiddenException('U Dont have The Permetion To Send Msg');

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
  async CreateGroup(
    ownerId,
    dto: CREATEGROUPSDTO,
    file: Express.Multer.File,
    localhostUrl: string,
  ):Promise<RETUR_OF_CHANNEL_DTO> {
    console.log(typeof dto.members);
    if (dto.hash) {
      const hash = await argon.hash(dto.hash);
      dto.hash = hash;
    }
    
    const existingUser = await this.prisma.user.findMany({
      where: { id: { in: dto.members } },
    });
    if(dto.members.length == 1)
      throw new BadRequestException('select users');
    if (existingUser.length !== dto.members.length) {
      throw new NotFoundException('One or more users not found');
    }
    const findeuniquenqme = await this.prisma.channel.findUnique({
      where: {
        name: dto.name,
      },
    });
    if (findeuniquenqme)
      throw new HttpException('Name is not unique', HttpStatus.BAD_REQUEST);
    let fileExtension;
    if (file) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png']; // Specify the allowed image extensions
      fileExtension = path.extname(file.originalname).toLowerCase(); // Extract the file extension
      if (!allowedExtensions.includes(fileExtension)) {
        throw new BadRequestException(
          'Invalid file type. Only images are allowed : jpg, jpeg ,png',
        );
      }
    }
    const createChannel = await this.prisma.channel.create({
      data: {
        ownerId: ownerId,
        type: dto.type,
        image: dto.image,
        hash: dto.hash,
        name: dto.name,
      },
    });
    if(file){
      const imageName = `${createChannel.id}${fileExtension}`;
      let imagePath = `uploads/${imageName}`;
      const stream = createWriteStream(imagePath);
      stream.write(file.buffer);
      stream.end();
      imagePath = `${localhostUrl}/uploads/${imageName}`;
      dto.image = imagePath;  
    }
    const updatechannel = await this.prisma.channel.update({
      where: { id: createChannel.id },
      data: {
        image: dto.image,
      },
      select:{
        id:true,
        ownerId:true,
        type:true,
        name:true,
        image:true,
        updatedAt:true
      }
    });
    const participantsData: Prisma.ParticipantsCreateManyInput[] = dto.members
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

    return updatechannel;
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
