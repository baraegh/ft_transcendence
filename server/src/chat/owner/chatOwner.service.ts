import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { OWNERCLEARCHATDTO, OWNERDTO, OWNERREMOVEDTO } from '../dto/owner.dto';

@Injectable()
export class ChatOwnerService {
  constructor(private prisma: PrismaService) {}

  async muteMember(userId: number, dto: OWNERDTO) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) throw new NotFoundException('user not found');
    const findChannel = await this.prisma.channel.findFirst({
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

  async removeMember(userId: number, dto: OWNERREMOVEDTO) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) throw new NotFoundException('user not found');
    const findChannel = await this.prisma.channel.findFirst({
      where: { id: dto.channelid },
    });
    if (!findChannel) throw new NotFoundException('channel not found');
    if (findChannel.ownerId != userId) {
      throw new ForbiddenException('You are not the Owner');
    }
    const participantUniqueInput: Prisma.ParticipantsWhereUniqueInput = {
      channelID_userID: {
        channelID: dto.channelid,
        userID: dto.usertoremove,
      },
    };
    const updateParticipant = await this.prisma.participants.delete({
      where: participantUniqueInput,
    });
    if (!updateParticipant) throw new NotFoundException('Entity not found');
  }

  async clearchat(userId: number, dto: OWNERCLEARCHATDTO) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) throw new NotFoundException('user not found');
    const findChannel = await this.prisma.channel.findFirst({
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
    if(clearchat.count === 0)
      throw new NotFoundException("Message already cleared");
  }

  async deletgroup(userId: number, dto: OWNERCLEARCHATDTO) {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) throw new NotFoundException('user not found');
    const findChannel = await this.prisma.channel.findFirst({
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
    if (!clearparticipants) throw new NotFoundException('error on delete');
  }
}
