import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { USerService } from './user.service';

@Module({
  controllers: [UserController],
  providers:[USerService],
})
export class UserModule {
  
}
