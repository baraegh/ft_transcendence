import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  OWNEADDADMINRDTO,
  CHANNELIDDTO,
  OWNERDTO,
  OWNEREDITDTO,
  OWNERPROPDTO,
} from '../dto/owner.dto';
import * as argon from 'argon2';

@Injectable()
export class ChatOwnerService {
  constructor(private prisma: PrismaService) {}

  async muteMember(userId: number, dto: OWNERDTO) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) throw new NotFoundException('user not found');
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelid },
    });
    if (!findChannel) throw new NotFoundException('channel not found');
    if (findChannel.ownerId != userId) {
      throw new ForbiddenException('You are not the Owner');
    }
    const participantUniqueInput: Prisma.ParticipantsWhereUniqueInput = {
      channelID_userID: {
        channelID: dto.channelid,
        userID: dto.usertomute,
      },
    };
    const updateParticipant = await this.prisma.participants.update({
      where: participantUniqueInput,
      data: {
        mut: dto.mute,
      },
    });
    if (!updateParticipant) throw new NotFoundException('Entity not found');
  }

  async removeMember(userId: number, dto: OWNERPROPDTO) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) throw new NotFoundException('user not found');
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelid },
    });
    if (!findChannel) throw new NotFoundException('channel not found');
    if (findChannel.ownerId != userId) {
      throw new ForbiddenException('You are not the Owner');
    }
    const participantUniqueInput: Prisma.ParticipantsWhereUniqueInput = {
      channelID_userID: {
        channelID: dto.channelid,
        userID: dto.otheruser,
      },
    };
    const updateParticipant = await this.prisma.participants.delete({
      where: participantUniqueInput,
    });
    if (!updateParticipant) throw new NotFoundException('Entity not found');
  }

  async clearchat(userId: number, dto: CHANNELIDDTO) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) throw new NotFoundException('user not found');
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelid },
    });
    if (!findChannel) throw new NotFoundException('channel not found');
    if (findChannel.ownerId != userId) {
      throw new ForbiddenException('You are not the Owner');
    }
    const clearchat = await this.prisma.messages.deleteMany({
      where: { channelID: dto.channelid },
    });
    if (!clearchat) throw new NotFoundException('error on delete');
    if (clearchat.count === 0)
      throw new NotFoundException('Message already cleared');
  }

  async deletgroup(userId: number, dto: CHANNELIDDTO) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) throw new NotFoundException('user not found');
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelid },
    });
    if (!findChannel) throw new NotFoundException('channel not found');
    if (findChannel.ownerId != userId) {
      throw new ForbiddenException('You are not the Owner');
    }
    const clearchat = await this.prisma.messages.deleteMany({
      where: { channelID: dto.channelid },
    });
    if (!clearchat) throw new NotFoundException('error on delete');

    const clearparticipants = await this.prisma.participants.deleteMany({
      where: { channelID: dto.channelid },
    });
    if (!clearparticipants) throw new NotFoundException('error on delete');

    const deletGroup = await this.prisma.channel.delete({
      where: { id: dto.channelid },
    });
    if (!deletGroup) throw new NotFoundException('error on delete');
  }

  async addAdmin(userId: number, dto: OWNEADDADMINRDTO) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) throw new NotFoundException('user not found');
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelid },
    });
    if (!findChannel) throw new NotFoundException('channel not found');
    if (findChannel.ownerId != userId) {
      throw new ForbiddenException('You are not the Owner');
    }
    const participantUniqueInput: Prisma.ParticipantsWhereUniqueInput = {
      channelID_userID: {
        channelID: dto.channelid,
        userID: dto.otheruser,
      },
    };
    const updateParticipant = await this.prisma.participants.update({
      where: participantUniqueInput,
      data: {
        role: dto.role,
      },
    });
    if (!updateParticipant) throw new NotFoundException('Entity not found');
  }

  // async inviteuser(userId: number, dto: OWNERPROPDTO) {
  //   const finduser = await this.prisma.user.findFirst({
  //     where: { id: userId },
  //   });
  //   if (!finduser) throw new NotFoundException('user not found');
  //   const findChannel = await this.prisma.channel.findUnique({
  //     where: { id: dto.channelid },
  //   });
  //   if (findChannel.ownerId != userId) {
  //     throw new ForbiddenException('You are not the Owner');
  //   }
  //   const findParticipant = await this.prisma.participants.findFirst({
  //     where: { channelID: dto.channelid, userID: dto.otheruser },
  //   });
  //   if (!findParticipant) {
  //     const creatnewmember = await this.prisma.participants.create({
  //       data: {
  //         channelID: dto.channelid,
  //         userID: dto.otheruser,
  //       },
  //     });
  //     if (!creatnewmember) throw new ForbiddenException('error at ading user');
  //   } else throw new ForbiddenException('user already added');
  // }

  async editgroup(userID: number, dto: OWNEREDITDTO) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userID },
    });
    if (!finduser) throw new NotFoundException('user not found');
    const findChannel = await this.prisma.channel.findUnique({
      where: { id: dto.channelid },
    });
    const findeuniquenqme = await this.prisma.channel.findUnique({
      where: {
        name: dto.name,
      },
    });
    if(findeuniquenqme)
      throw new HttpException('Name is not unique', HttpStatus.BAD_REQUEST);
    if (findChannel.ownerId != userID) {
      throw new ForbiddenException('You are not the Owner');
    }
    if (findChannel.type === 'PERSONEL')
      throw new ForbiddenException('Acces Denied');
    switch (dto.type) {
      case 'PRIVATE':
        dto.hash = null;
        break;
      case 'PROTECTED':
        if (!dto.hash) {
          throw new ForbiddenException('enter password');
        } else dto.hash = await argon.hash(dto.hash);
        break;
      case 'PUBLIC':
        dto.hash = null;
        break;
      default:
        throw new ForbiddenException('Acces Denied');
    }

    await this.prisma.channel.update({
      where: { id: dto.channelid },
      data: {
        type: dto.type,
        image: dto.image,
        hash: dto.hash,
        name: dto.name,
      },
    });
  }
}
