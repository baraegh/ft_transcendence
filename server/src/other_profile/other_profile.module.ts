import { Module } from '@nestjs/common';
import { OtherProfileController } from './other_profile.controller';
import { OtherProfileService } from './other_profile.service';

@Module({
  controllers: [OtherProfileController],
  providers: [OtherProfileService]
})
export class OtherProfileModule {}
