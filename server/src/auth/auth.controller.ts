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
import { Jwt_refresh_Guard } from './guard';
import { GetUser, Public } from './decorator';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthDto_42 } from './42_auth/dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    res.cookie('acces_token', token.acces_token, {
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

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(Jwt_refresh_Guard)
  refreshToken(@Req() req: Request): Promise<Token> {
    console.log(req);
    const user = req.user;
    return this.authService.refreshToken(user['sub'], user['refreshToken']);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Post('logout')
  logoutlocal(@Req() req: Request) {
    const user = req.user;
    return this.authService.logoutlocal(user['id']);
  }
}
