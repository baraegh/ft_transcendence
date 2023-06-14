import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

type jwtPayload = {
  sub: number
  email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService,) {
    const secret = config.get('SECRETE_TOKEN');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate( payload: jwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub // Assuming `payload.sub` contains the user's ID
      }
    });
    delete user.hashedRT;
    return user;
  }
}
