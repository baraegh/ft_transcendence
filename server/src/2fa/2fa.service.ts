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

  //generate
  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();

    await this.prisma.user.update({
      where: { id: user.id },
      data: { twoFactorAuthenticationSecret: secret },
    });
    const otpauthUrl = authenticator.keyuri(
      user.username,
      'Keip_It_Random',
      secret,
    );

    // await this.setTwoFactorAuthenticationSecret(secret, user.id);
    const qrCodeImage1 = await qrcode.toDataURL(otpauthUrl);
    const qrCodeImage = qrCodeImage1;
    return {
      qrCodeImage,
    };
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
    // Fetch the user's secret from the database
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorAuthenticationSecret: true },
    });

    // Verify the provided code using the user's secret
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
    // Fetch the user's secret from the database
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorAuthenticationSecret: true },
    });

    // Verify the provided code using the user's secret
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
