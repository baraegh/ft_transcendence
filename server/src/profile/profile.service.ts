import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Edite_Profile_DTO } from './profile.dto';
import { createWriteStream } from 'fs';
import * as path from 'path';
import { USERINFODTO } from 'src/user/dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async edite_profile(
    localhostUrl:string,
    userId: number,
    dto: Edite_Profile_DTO,
    file: Express.Multer.File,
  ):Promise<USERINFODTO> {
    const finduser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!finduser) throw new NotFoundException('user not found');

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png']; // Specify the allowed image extensions
    const fileExtension = path.extname(file.originalname).toLowerCase(); // Extract the file extension
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException('Invalid file type. Only images are allowed : jpg, jpeg ,png');
    }
    const imageName = `${userId}${fileExtension}`;
    let imagePath = `uploads/${imageName}`;

    const finduniquename = await this.prisma.user.findUnique({
      where : {
        username:dto.name
      }
    })

    if(finduniquename)  throw new BadRequestException('this name already exists');
    const stream = createWriteStream(imagePath);
    stream.write(file.buffer);
    stream.end();

    imagePath = `${localhostUrl}/uploads/${imageName}`;


    const updatedProfile = await this.prisma.user.update({
      where: { id: userId },
      select:{
        id: true,
        username:  true,
        image: true,
        gameWon:  true,
        gameLost:  true,
        achievements:  true,
      },
      data: { image: imagePath , username:dto.name},
    });

    return updatedProfile;
  }
}

// formData.append('userId', '123'); // Example user ID
// formData.append('image', fileInput.files[0]); // Example file input element with the ID 'fileInput'
// formData.append('name', 'John Doe'); // Example name
