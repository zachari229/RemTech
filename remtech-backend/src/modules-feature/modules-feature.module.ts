import { Module } from '@nestjs/common';
import { ModulesFeatureService } from './modules-feature.service';
import { ModulesFeatureController } from './modules-feature.controller';

@Module({
  controllers: [ModulesFeatureController],
  providers: [ModulesFeatureService],
  exports: [ModulesFeatureService],
})
export class ModulesFeatureModule {}