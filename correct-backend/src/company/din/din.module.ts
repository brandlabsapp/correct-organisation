import { Module } from '@nestjs/common';
import { DinService } from './din.service';
import { DinController } from './din.controller';

@Module({
  controllers: [DinController],
  providers: [DinService],
})
export class DinModule {}
