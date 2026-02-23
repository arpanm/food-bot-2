import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MenuModule } from './menu/menu.module';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
  imports: [OnboardingModule, MenuModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
