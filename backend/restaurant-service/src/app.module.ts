import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CampaignsModule } from './campaigns/campaigns.module';
import { MenuModule } from './menu/menu.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    OnboardingModule,
    MenuModule,
    PromotionsModule,
    CampaignsModule,
    ReviewsModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
