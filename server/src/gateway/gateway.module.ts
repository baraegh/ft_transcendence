import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MyGateway } from './gateway';
import { AuthLogic } from './getwayLogic';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [MyGateway,AuthLogic],
  exports: [AuthLogic],
})
export class GatwayModule {
  }
