import { Module } from '@nestjs/common';
import { ChariowService } from './chariow.service';

@Module({
  providers: [ChariowService],
  exports: [ChariowService],
})
export class ChariowModule {}