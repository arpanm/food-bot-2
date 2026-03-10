import { Injectable, NotFoundException } from '@nestjs/common';
import { OnboardingService } from '../onboarding/onboarding.service';
import type { CreateMenuItemDto, MenuItemDto, UpdateMenuItemDto } from './dto/menu.dto';

@Injectable()
export class MenuService {
  private items = new Map<string, MenuItemDto & { id: string }>();
  private nextId = 1;

  constructor(private readonly onboarding: OnboardingService) {}

  list(restaurantId: string): (MenuItemDto & { id: string })[] {
    this.onboarding.getOrThrow(restaurantId);
    return Array.from(this.items.values()).filter((i) => i.restaurantId === restaurantId);
  }

  get(restaurantId: string, itemId: string): (MenuItemDto & { id: string }) | null {
    this.onboarding.getOrThrow(restaurantId);
    const item = this.items.get(itemId);
    return item && item.restaurantId === restaurantId ? item : null;
  }

  create(restaurantId: string, dto: CreateMenuItemDto): MenuItemDto & { id: string } {
    this.onboarding.getOrThrow(restaurantId);
    const id = `item-${this.nextId++}`;
    const item: MenuItemDto & { id: string } = {
      id,
      restaurantId,
      name: dto.name,
      description: dto.description,
      category: dto.category,
      priceCents: dto.priceCents,
      available: dto.available ?? true,
      imageUrl: dto.imageUrl,
    };
    this.items.set(id, item);
    return { ...item };
  }

  update(
    restaurantId: string,
    itemId: string,
    dto: UpdateMenuItemDto
  ): MenuItemDto & { id: string } {
    const item = this.get(restaurantId, itemId);
    if (!item) throw new NotFoundException('Menu item not found');
    if (dto.name !== undefined) item.name = dto.name;
    if (dto.description !== undefined) item.description = dto.description;
    if (dto.category !== undefined) item.category = dto.category;
    if (dto.priceCents !== undefined) item.priceCents = dto.priceCents;
    if (dto.available !== undefined) item.available = dto.available;
    if (dto.imageUrl !== undefined) item.imageUrl = dto.imageUrl;
    this.items.set(itemId, item);
    return { ...item };
  }

  delete(restaurantId: string, itemId: string): void {
    const item = this.get(restaurantId, itemId);
    if (!item) throw new NotFoundException('Menu item not found');
    this.items.delete(itemId);
  }

  setAvailability(
    restaurantId: string,
    itemId: string,
    available: boolean
  ): MenuItemDto & { id: string } {
    return this.update(restaurantId, itemId, { available });
  }
}
