import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { USerService } from './user.servive';

@Module({
  controllers: [UserController],
  providers:[USerService],
})
export class UserModule {
  
}
