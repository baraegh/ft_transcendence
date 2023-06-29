import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    const secret = config.get('SECRETE_TOKEN');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies['access_token'];
        },
      ]),
      secretOrKey: secret,
    });
  }

  async validate(@Req() req: Request) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: req['sub'],
      },
    });
    if(!user) throw new NotFoundException('user not found');
    return user;
  }
}
