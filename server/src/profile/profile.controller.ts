import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { Edite_Profile_DTO } from './profile.dto';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';

@ApiBearerAuth()
@ApiTags('Profile')
@UseGuards(JwtGuard)
@Controller('prifile')
export class ProfileController {
  constructor(private profile: ProfileService) {}

  
  @ApiBody({
    type: Edite_Profile_DTO,
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post('edite')
  async EditeProfile(  @UploadedFile() file: Express.Multer.File,@Req() req: Request, @Body() dto: Edite_Profile_DTO) {

  }
}
