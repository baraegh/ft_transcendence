import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Token } from './types';
import { AuthDto_42 } from './42_auth/dtos';
import { Request } from 'express';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signuplocal(dto: AuthDto_42): Promise<Token> {
    // check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      return;
    }
    const user = await this.prisma.user.create({
      data: {
        username: dto.userName,
        email: dto.email,
        id:dto.id,
        image:dto.link,
      },
    });
    const tokens = await this.signToken(user.id);
    await this.updateRthash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signinlocal(dto: AuthDto_42): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email},
    });
    if (!user) {
      throw new ForbiddenException('You Are Fucked');
    }
      const tokens = await this.signToken(user.id);
      await this.updateRthash(user.id, tokens.refresh_token);
      return tokens;
  }
  async logoutlocal(UserID: number) {
    await this.prisma.user.updateMany({
      where: {
        id: UserID,
        hashedRT: {
          not: null,
        },
      },
      data: {
        hashedRT: null,
      },
    });
  }
  async refreshToken(UserID: number, rt: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: UserID,
      },
    });
    if (!user || !user.hashedRT) throw new ForbiddenException('Acces Denied');
    const rtMatches = await argon.verify(user.hashedRT, rt);
    if (!rtMatches) throw new ForbiddenException('Acces Denied');
    const tokens = await this.signToken(user.id);
    await this.updateRthash(user.id, tokens.refresh_token);
    return tokens;
    
  }

  async updateRthash(UserID: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: UserID,
      },
      data: {
        hashedRT: hash,
      },
    });
  }

  async signToken(UserID: number): Promise<Token> {


    const payload = { sub: UserID };
    const secret = this.config.get('SECRETE_TOKEN');
    const secret_refresh = this.config.get('SECRETE_TOKEN_REFRESH');
    const [at, rt] = await Promise.all([
      await this.jwt.signAsync(payload, {
        expiresIn: '600m',
        secret: secret,
        jwtid: this.config.get<string>('SECRETE_JWT_ID'),
      }),
      await this.jwt.signAsync(payload, {
        expiresIn: '600m',
        secret: secret_refresh,
        jwtid: this.config.get<string>('SECRETE_JWT_ID'),
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async checkeUser(Id: number):Promise<boolean> {
    // Implement your user validation logic here
    const user = await this.prisma.user.findUnique({
      where : {
        id:Id
      }
    });
    if(user)
      return true;
    else
      return false;
  }
}
