import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guard';
import { Midlewareofcookies } from './midleware/midleware.middleware';
import { FriendsModule } from './friends/friends.module';
import { ChatModule } from './chat/chat.module';
import { ProfileModule } from './profile/profile.module';
import { GameModule } from './game/game.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { _2faModule } from './2fa/2fa.module';
import { GatwayModule } from './gateway/gateway.module';
import { AuthLogic } from './gateway/getwayLogic';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    FriendsModule,
    ChatModule,
    ProfileModule,
    GameModule,
    LeaderboardModule,
    _2faModule,
    GatwayModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
