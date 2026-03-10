import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/promotion.dto';
import { PromotionsService } from './promotions.service';

@Controller('restaurants/:restaurantId/promotions')
export class PromotionsController {
  constructor(private readonly promotions: PromotionsService) {}

  @Get()
  list(@Param('restaurantId') restaurantId: string) {
    return this.promotions.list(restaurantId);
  }

  @Get(':id')
  get(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    const p = this.promotions.get(restaurantId, id);
    if (!p) throw new NotFoundException('Promotion not found');
    return p;
  }

  @Post()
  create(@Param('restaurantId') restaurantId: string, @Body() dto: CreatePromotionDto) {
    return this.promotions.create(restaurantId, dto);
  }

  @Patch(':id')
  update(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePromotionDto
  ) {
    return this.promotions.update(restaurantId, id, dto);
  }

  @Delete(':id')
  delete(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    this.promotions.delete(restaurantId, id);
  }
}
