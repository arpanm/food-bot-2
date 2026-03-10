import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateReviewDto, ReviewDto, ReplyReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  private reviews = new Map<string, ReviewDto & { id: string }>();
  private nextId = 1;

  listByRestaurant(restaurantId: string): (ReviewDto & { id: string })[] {
    return Array.from(this.reviews.values()).filter((r) => r.restaurantId === restaurantId);
  }

  get(id: string): (ReviewDto & { id: string }) | null {
    return this.reviews.get(id) ?? null;
  }

  create(restaurantId: string, userId: string, dto: CreateReviewDto, userName?: string): ReviewDto & { id: string } {
    const id = `rev-${this.nextId++}`;
    const now = new Date().toISOString();
    const review: ReviewDto & { id: string } = {
      id,
      restaurantId,
      orderId: dto.orderId,
      userId,
      userName,
      rating: dto.rating,
      comment: dto.comment,
      createdAt: now,
    };
    this.reviews.set(id, review);
    return { ...review };
  }

  reply(restaurantId: string, reviewId: string, dto: ReplyReviewDto): ReviewDto & { id: string } {
    const r = this.reviews.get(reviewId);
    if (!r || r.restaurantId !== restaurantId) throw new NotFoundException('Review not found');
    r.reply = dto.reply;
    r.repliedAt = new Date().toISOString();
    return { ...r };
  }

  aggregate(restaurantId: string): { average: number; count: number } {
    const list = this.listByRestaurant(restaurantId);
    if (list.length === 0) return { average: 0, count: 0 };
    const sum = list.reduce((s, r) => s + r.rating, 0);
    return { average: sum / list.length, count: list.length };
  }
}
