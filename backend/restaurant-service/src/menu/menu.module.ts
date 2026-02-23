import { Module } from '@nestjs/common';
import { OnboardingModule } from '../onboarding/onboarding.module';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [OnboardingModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
