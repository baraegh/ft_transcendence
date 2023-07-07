import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Edite_Profile_DTO,
  MATCH_HISTORY_DTO,
  SELECTE_DATA_OF_OTHER_PLAYER,
} from './profile.dto';
import { createWriteStream } from 'fs';
import * as path from 'path';
import { USERINFODTO } from 'src/user/dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async edite_profile(
    localhostUrl: string,
    userId: number,
    dto: Edite_Profile_DTO,
    file: Express.Multer.File,
  ): Promise<USERINFODTO> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const allowedExtensions = ['.jpg', '.jpeg', '.png']; 
    const fileExtension = path.extname(file.originalname).toLowerCase(); 
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        'Invalid file type. Only images are allowed : jpg, jpeg ,png',
      );
    }
    const imageName = `${userId}${fileExtension}`;
    let imagePath = `uploads/${imageName}`;

    const finduniquename = await this.prisma.user.findUnique({
      where: {
        username: dto.name,
      },
    });

    if (finduniquename)
      throw new BadRequestException('this name already exists');
    const stream = createWriteStream(imagePath);
    stream.write(file.buffer);
    stream.end();

    imagePath = `${localhostUrl}/uploads/${imageName}`;

    const updatedProfile = await this.prisma.user.update({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        image: true,
        gameWon: true,
        gameLost: true,
        achievements: true,
      },
      data: { image: imagePath, username: dto.name },
    });

    return updatedProfile;
  }

  async matchHistory(userId: number): Promise<MATCH_HISTORY_DTO[]> {
    const matchHistory = await this.prisma.match_History.findMany({
      where: {
        OR: [
          {
            user1Id: userId,
          },
          {
            user2Id: userId,
          },
        ],
      },
      select: {
        id: true,
        user1Id: true,
        user2Id: true,
        user1P: true,
        user2P: true,
        user1: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
        user2: {
          select: {
            id: true,
            image: true,
            username: true,
          }, 
        },
      },
    });

    const matchHistoryDTOs = matchHistory.map((match) => {
      let otherUser: SELECTE_DATA_OF_OTHER_PLAYER;
      let win: boolean;
      if (match.user1Id === userId) {
        otherUser = match.user2;
      } else {
        otherUser = match.user1;
        const temp = match.user1P;
        match.user1P = match.user2P;
        match.user2P = temp;
      }
      if (match.user1P >= match.user2P) win = true;
      else win = false;
      return {
        matchId: match.id,
        otherUser,
        win: win,
        user1P: match.user1P,
        user2P: match.user2P,
      };
    });

    return matchHistoryDTOs;
  }
}
