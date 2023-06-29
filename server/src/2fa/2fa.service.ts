import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { toDataURL } from 'qrcode';
import * as qrcode from 'qrcode';

@Injectable()
export class _2faService {
  jwtService: any;
  constructor(private prisma: PrismaService) {}

  async loginWith2fa(userWithoutPsw: Partial<User>) {
    const payload = {
      email: userWithoutPsw.email,
      isTwoFactorAuthenticationEnabled:
        !!userWithoutPsw.isTwoFactorAuthenticationEnabled,
      isTwoFactorAuthenticated: true,
    };

    return {
      email: payload.email,
      access_token: this.jwtService.sign(payload),
    };
  }

  isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isTwoFactorAuthenticationEnabled: true,
      },
    });
  }

  //generate

  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.username,
      'Keip_It_Random',
      secret,
    );

    // await this.setTwoFactorAuthenticationSecret(secret, user.id);
    const qrCodeImage = await qrcode.toDataURL(otpauthUrl);
    return {
      secret,
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
}
