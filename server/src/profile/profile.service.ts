import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Edite_Profile_DTO } from './profile.dto';
import { createWriteStream } from 'fs';
import path from 'path';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async edite_profile(
    userId: number,
    dto: Edite_Profile_DTO,
    file: Express.Multer.File,
  ) {
    const finduser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!finduser) throw new NotFoundException('user not found');

    const fileExtension = path.extname(file.originalname); // Extract the file extension
    const imageName = `${userId}${fileExtension}`;
    const imagePath = `uploads/${imageName}`;

    const stream = createWriteStream(imagePath);
    stream.write(file.buffer);
    stream.end();

    // Store the image link in the database using Prisma
    // const updatedProfile = await this.prisma.profile.update({
    //   where: { userId: profileData.userId },
    //   data: { image: imagePath },
    // });

    // return updatedProfile;
  }
}
