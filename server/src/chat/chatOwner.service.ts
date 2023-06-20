import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OWNERDTO } from './dto/owner.dto';
import { Prisma } from '@prisma/client';

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
        userID: userId,
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
}
