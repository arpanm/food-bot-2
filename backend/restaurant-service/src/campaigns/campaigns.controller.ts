import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { CampaignsService } from './campaigns.service';

@Controller('restaurants/:restaurantId/campaigns')
export class CampaignsController {
  constructor(private readonly campaigns: CampaignsService) {}

  @Get()
  list(@Param('restaurantId') restaurantId: string) {
    return this.campaigns.listCampaigns(restaurantId);
  }

  @Get(':id')
  get(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    const c = this.campaigns.getCampaign(restaurantId, id);
    if (!c) throw new NotFoundException('Campaign not found');
    return c;
  }

  @Post()
  create(@Param('restaurantId') restaurantId: string, @Body() dto: CreateCampaignDto) {
    return this.campaigns.createCampaign(restaurantId, dto);
  }

  @Patch(':id')
  update(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto
  ) {
    return this.campaigns.updateCampaign(restaurantId, id, dto);
  }

  @Delete(':id')
  delete(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    this.campaigns.deleteCampaign(restaurantId, id);
  }
}

@Controller('restaurants/:restaurantId/segments')
export class SegmentsController {
  constructor(private readonly campaigns: CampaignsService) {}

  @Get()
  list(@Param('restaurantId') restaurantId: string) {
    return this.campaigns.listSegments(restaurantId);
  }

  @Post()
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: { name: string; description?: string; rule?: string }
  ) {
    return this.campaigns.createSegment(restaurantId, dto);
  }
}
