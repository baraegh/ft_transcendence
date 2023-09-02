import {Headers, Body, Controller, Post, Req, Res, UseGuards, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { _2faService } from './2fa.service';
import { JwtGuard, Jwt_refresh_Guard } from 'src/auth/guard';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

import { GetUser, Public } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { _2FA_DTO } from './_2fa.dto';
import { Response,Request } from 'express';


@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('2FA')
@Controller('2fa')
export class _2faController {
  constructor(private _2fa: _2faService) {}

  @Post('enable')
  async enableTwoFactorAuth(@GetUser() user: User) {
    const { qrCodeImage } =
      await this._2fa.generateTwoFactorAuthenticationSecret(user);
    return qrCodeImage;
  }

  @ApiOperation({
    summary: 'disble 2fa',
  })
  @Post('disable')
  async disableTwoFactorAuth(@GetUser() user: User) {
      await this._2fa.disableTwoFactorAuthentication(user);
  }

  @Post('verified_first_time')
  async verifyTwoFactorAuthFirstTime(@Req() req, @Body() body: _2FA_DTO) {
    await this._2fa.verifyTwoFactorAuthFirstTime(
      req.user['id'],
      body.secret,
    );
  }

  @Public()
  @UseGuards(Jwt_refresh_Guard)
  @HttpCode(HttpStatus.OK)
  @Post('verified')
  async verifyTwoFactorAuth(@Req() req: Request, @Body() body: _2FA_DTO) {
    await this._2fa.verifyTwoFactorAuth(
      req.user['sub'],
      body.secret,
    );
  }

  
  @ApiOperation({
    summary: 'retturn : true or false',
  })
  @Get('isenable')
  async isenable(@GetUser() user: User) {
     return await this._2fa.isenable(user);
  }
}
