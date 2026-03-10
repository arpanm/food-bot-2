import { Module } from '@nestjs/common';
import { CampaignsController, SegmentsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

@Module({
  controllers: [CampaignsController, SegmentsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
