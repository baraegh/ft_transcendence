import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

type jwtPayload = {
  sub: number;
  email: string;
};
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    const secret = config.get<string>('SECRETE_TOKEN_REFRESH');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies['refresh_token'];
        },
      ]),
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: jwtPayload) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    return {
      ...payload,
      refreshToken,
    };
  }
}
