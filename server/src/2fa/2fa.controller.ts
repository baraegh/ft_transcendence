import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { _2faService } from './2fa.service';
import { JwtGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { Response } from 'express';
import * as qrcode from 'qrcode';
import * as sharp from 'sharp';
import { authenticator } from 'otplib';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('2FA')
@Controller('2fa')
export class _2faController {
  constructor(private _2fa: _2faService) {}

  //   @Post('2fa/turn-on')
  //   async turnOnTwoFactorAuthentication(@Req() request, @Body() body) {
  //     const isCodeValid = this._2fa.isTwoFactorAuthenticationCodeValid(
  //       body.twoFactorAuthenticationCode,
  //       request.user,
  //     );
  //     if (!isCodeValid) {
  //       throw new UnauthorizedException('Wrong authentication code');
  //     }
  //     await this._2fa.turnOnTwoFactorAuthentication(request.user.id);
  //   }

  @Post('2fa/authenticate')
  @HttpCode(200)
  async authenticate(@Req() request, @Body() body) {
    const isCodeValid = this._2fa.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      request.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    // return this._2fa.loginWith2fa(request.user);
    return 'hi br';
  }

  @Post('enable')
  async enableTwoFactorAuth(@Req() req, @Res() res: Response) {
    const userId = req.user['id']; // Extract the authenticated user's ID
    const { secret } = await this.generateTwoFactorAuthenticationSecret(userId);

    const otpauthUrl = authenticator.keyuri(
      req.user.username,
      'Keip_It_Random',
      secret,
    );

    // Generate the QR code
    const qrCodeBuffer = await qrcode.toBuffer(otpauthUrl, {
      errorCorrectionLevel: 'L',
    });

    // Resize the QR code if needed
    const qrCodeImage = await sharp(qrCodeBuffer).resize(300, 300).png().toBuffer();

    // Set the response headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename=qrcode.png');

    // Return the image to the client
    res.send(qrCodeImage);
    res.send(secret);
  }

  async generateTwoFactorAuthenticationSecret(userId: string) {
    const secret = authenticator.generateSecret();
    return {
      secret,
    };
  }

  
}
