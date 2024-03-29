import { Module,  } from '@nestjs/common';
import { MyGateway } from './gateway';
import { AuthLogic } from './getwayLogic';
import { GameGateway } from './game.gateway';

@Module({
  providers: [MyGateway,AuthLogic],
  exports: [AuthLogic],
})
export class GatwayModule {
  }