import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreatePromotionDto, PromotionDto, UpdatePromotionDto } from './dto/promotion.dto';

@Injectable()
export class PromotionsService {
  private promotions = new Map<string, PromotionDto & { id: string }>();
  private nextId = 1;

  list(restaurantId: string): (PromotionDto & { id: string })[] {
    return Array.from(this.promotions.values()).filter((p) => p.restaurantId === restaurantId);
  }

  get(restaurantId: string, id: string): (PromotionDto & { id: string }) | null {
    const p = this.promotions.get(id);
    return p && p.restaurantId === restaurantId ? p : null;
  }

  create(restaurantId: string, dto: CreatePromotionDto): PromotionDto & { id: string } {
    const id = `promo-${this.nextId++}`;
    const now = new Date().toISOString();
    const promo: PromotionDto & { id: string } = {
      id,
      restaurantId,
      name: dto.name,
      type: dto.type as PromotionDto['type'],
      valueCents: dto.valueCents,
      valuePercent: dto.valuePercent,
      minOrderCents: dto.minOrderCents,
      code: dto.code,
      startAt: dto.startAt,
      endAt: dto.endAt,
      active: dto.active ?? true,
      createdAt: now,
    };
    this.promotions.set(id, promo);
    return { ...promo };
  }

  update(restaurantId: string, id: string, dto: UpdatePromotionDto): PromotionDto & { id: string } {
    const p = this.get(restaurantId, id);
    if (!p) throw new NotFoundException('Promotion not found');
    if (dto.name !== undefined) p.name = dto.name;
    if (dto.type !== undefined) p.type = dto.type;
    if (dto.valueCents !== undefined) p.valueCents = dto.valueCents;
    if (dto.valuePercent !== undefined) p.valuePercent = dto.valuePercent;
    if (dto.minOrderCents !== undefined) p.minOrderCents = dto.minOrderCents;
    if (dto.code !== undefined) p.code = dto.code;
    if (dto.startAt !== undefined) p.startAt = dto.startAt;
    if (dto.endAt !== undefined) p.endAt = dto.endAt;
    if (dto.active !== undefined) p.active = dto.active;
    return { ...p };
  }

  delete(restaurantId: string, id: string): void {
    const p = this.get(restaurantId, id);
    if (!p) throw new NotFoundException('Promotion not found');
    this.promotions.delete(id);
  }
}
