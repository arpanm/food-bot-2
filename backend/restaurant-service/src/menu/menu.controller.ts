import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu.dto';
import { MenuService } from './menu.service';

@Controller('restaurants/:restaurantId/menu')
export class MenuController {
  constructor(private readonly menu: MenuService) {}

  @Get('items')
  list(@Param('restaurantId') restaurantId: string) {
    return this.menu.list(restaurantId);
  }

  @Get('items/:id')
  get(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    const item = this.menu.get(restaurantId, id);
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  @Post('items')
  create(@Param('restaurantId') restaurantId: string, @Body() dto: CreateMenuItemDto) {
    return this.menu.create(restaurantId, dto);
  }

  @Patch('items/:id')
  update(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMenuItemDto
  ) {
    return this.menu.update(restaurantId, id, dto);
  }

  @Delete('items/:id')
  delete(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    this.menu.delete(restaurantId, id);
  }

  @Patch('items/:id/availability')
  setAvailability(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() body: { available: boolean }
  ) {
    return this.menu.setAvailability(restaurantId, id, body.available);
  }
}
