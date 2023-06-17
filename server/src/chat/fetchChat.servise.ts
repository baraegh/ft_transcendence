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

@Injectable()
export class FetchChatService {
  constructor(private prisma: PrismaService) {}

  async ShowAllMsgsOfChannel(channelID: string):Promise<FETCHMSG[]>  {
    const findChannel = await this.prisma.channel.findUnique({
        where:{id:channelID}
    })
    if(!findChannel){
        throw new NotFoundException('channel not found')
    }
    const messages = await this.prisma.messages.findMany({
      where: {
        channelID
      },
      select: {
        content: true,
        timeSend: true,
      },
    });
    messages.sort((a, b) => a.timeSend.getTime() - b.timeSend.getTime());
    return messages;
  }
}
