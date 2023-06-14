import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthDto_42 } from '../dtos/42_auth.dot';


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get<string>('CLIENT_ID'),
      clientSecret: config.get<string>('CLIENT_SECRITE'),
      callbackURL: 'http://localhost:3000/auth/42/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile : any, done: VerifyCallback): Promise<AuthDto_42> {
    try {
      // Perform any additional validation or data retrieval logic here
      const user = {
        id: profile._json.id,
        userName: profile._json.login,
        email: profile._json.email,
        link:profile._json.image.link,
      };
      done(null, user);
      return user
    } catch (error) {
      done(error, false);
    }
  }
}