import { Module } from '@nestjs/common';
import { _2faController } from './2fa.controller';
import { _2faService } from './2fa.service';

@Module({
  controllers: [_2faController],
  providers: [_2faService]
})
export class _2faModule {}
