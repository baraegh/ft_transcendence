import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Token } from './types';
import { JwtGuard, Jwt_refresh_Guard } from './guard';
import { GetUser, Public } from './decorator';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthDto_42 } from './42_auth/dtos';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Get()
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth() {}

  @Public()
  @UseGuards(AuthGuard('42'))
  @Get('42/callback')
  async fortyTwoAuthCallback(@Req() req: Request, @Res() res: Response) {
    let token = null;
    const dto_42 = new AuthDto_42();
    dto_42.userName = req.user['userName'];
    dto_42.email = req.user['email'];
    dto_42.id = req.user['id'];
    dto_42.link = req.user['link'];
    const is_exist: boolean = await this.authService.checkeUser(dto_42.id);
    if (!is_exist) token = await this.authService.signuplocal(dto_42);
    else token = await this.authService.signinlocal(dto_42);
    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.cookie('refresh_token', token.refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    const finde_active2fa = await this.prisma.user.findUnique({
      where: { id: req.user['id'] },
      select: { isTwoFactorAuthenticationEnabled: true },
    });
    if (finde_active2fa.isTwoFactorAuthenticationEnabled === true) {
      const image = await this.prisma.user.findUnique({
        where: { id: req.user['id'] },
        select: { image: true },
      });
      res.clearCookie('access_token');
      res.redirect(
        'http://localhost:5173/TwoFactorAuth/?image=' +
          encodeURIComponent(image.image),
      );
    } else res.redirect('http://localhost:5173/home/');
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(Jwt_refresh_Guard)
  async refreshToken(@Res() res: Response, @Req() req: Request) {
    const user = req.user;
    const token = await this.authService.refreshToken(
      user['sub'],
      user['refreshToken'],
    );
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.cookie('refresh_token', token.refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.end();
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Post('logout')
  logoutlocal(@Res() res: Response, @Req() req: Request) {
    const user = req.user;
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.authService.logoutlocal(user['id']);
    res.end();
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Get('check')
  checkifuotorize() {
  }
}
