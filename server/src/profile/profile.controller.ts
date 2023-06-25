import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { Edite_Profile_DTO } from './profile.dto';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { USERINFODTO } from 'src/user/dto';

@ApiBearerAuth()
@ApiTags('Profile')
@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profile: ProfileService) {}

  @ApiResponse({
    type:USERINFODTO
  })
  @ApiBody({
    type: Edite_Profile_DTO,
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post('edite')
  async EditeProfile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() dto: Edite_Profile_DTO,
  ): Promise<USERINFODTO> {
    const userid = req.user['id'];
    const localhostUrl = `${req.protocol}://${req.get('host')}`;
    return await this.profile.edite_profile(localhostUrl, userid, dto, file);
  }
}

/*******************************/
@ApiBearerAuth()
@ApiTags('uploads')
@UseGuards(JwtGuard)
@Controller('uploads')
export class UploadsController {
  @Get(':filename')
  async getImage(
    @Param('filename') filename: string,
    @Res() res: Response<any>,
  ) {
    const imagePath = join(process.cwd(), 'uploads', filename);
    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException('File not found');
    }
    res.sendFile(imagePath);  
  }
}
