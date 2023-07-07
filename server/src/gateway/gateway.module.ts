import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MyGateway } from './gateway';
import { AuthLogic } from './getwayLogic';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  providers: [MyGateway,AuthLogic,ChatGateway],
  exports: [AuthLogic],
})
export class GatwayModule {
  }
