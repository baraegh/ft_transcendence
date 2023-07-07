import { Module,  } from '@nestjs/common';
import { MyGateway } from './gateway';
import { AuthLogic } from './getwayLogic';

@Module({
  providers: [MyGateway,AuthLogic],
  exports: [AuthLogic],
})
export class GatwayModule {
  }
