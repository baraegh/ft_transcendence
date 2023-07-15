import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';

@Injectable()
export class _2faService {
  jwtService: any;
  constructor(private prisma: PrismaService) {}

  async generateTwoFactorAuthenticationSecret(user: User) {
    console.log("here");
    const secret = authenticator.generateSecret();
    const finduser =   await this.prisma.user.findUnique({
      where: { id: user.id },
    })
    if(finduser.isTwoFactorAuthenticationEnabled === true)
    {
      const qrCodeImage = "";
      return {qrCodeImage};
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { twoFactorAuthenticationSecret: secret },
    });
    const otpauthUrl = authenticator.keyuri(
      user.username,
      'Keip_It_Random',
      secret,
    );;
    const qrCodeImage1 = await qrcode.toDataURL(otpauthUrl);
    const qrCodeImage = qrCodeImage1;
    return {
      qrCodeImage,
    };
  }


  async disableTwoFactorAuthentication(user: User) {
    const finduser =   await this.prisma.user.findUnique({
      where: { id: user.id },
    })
    if(finduser.isTwoFactorAuthenticationEnabled === false)
      throw new BadRequestException("the 2FA is disable");
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isTwoFactorAuthenticationEnabled: false ,twoFactorAuthenticationSecret 
      : null},
    });
  }

  async isenable(user: User) {
    const finduser =   await this.prisma.user.findUnique({
      where: { id: user.id },
    })
    return finduser.isTwoFactorAuthenticationEnabled;
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFactorAuthenticationSecret: secret,
      },
    });
  }

  async verifyTwoFactorAuth(userId: number, verificationCode: string) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorAuthenticationSecret: true },
    });

    const isVerified = this.verifyCode(
      verificationCode,
      user.twoFactorAuthenticationSecret,
    );
    if (!isVerified) {
      throw new BadRequestException('Invalid code');
    }
  }

  verifyCode(verificationCode: string, secret: string): boolean {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: verificationCode,
    });

    return verified;
  }

  async verifyTwoFactorAuthFirstTime(userId: number, verificationCode: string) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorAuthenticationSecret: true },
    });
    const isVerified = this.verifyCode(
      verificationCode,
      user.twoFactorAuthenticationSecret,
    );
    if (isVerified) {
      const t = await this.prisma.user.update({
        where: { id: userId },
        data: { isTwoFactorAuthenticationEnabled: true },
      });
    } else {
      throw new BadRequestException('Invalid code');
    }
  }
}
