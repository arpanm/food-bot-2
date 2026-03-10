import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { CreateReviewDto, ReplyReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

const X_USER_ID = 'x-user-id';

@Controller('restaurants/:restaurantId/reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get('aggregate')
  aggregate(@Param('restaurantId') restaurantId: string) {
    return this.reviews.aggregate(restaurantId);
  }

  @Get()
  list(@Param('restaurantId') restaurantId: string) {
    return this.reviews.listByRestaurant(restaurantId);
  }

  @Post()
  create(
    @Param('restaurantId') restaurantId: string,
    @Headers(X_USER_ID) xUserId: string | undefined,
    @Body() dto: CreateReviewDto
  ) {
    const userId = xUserId?.trim() || 'anonymous';
    return this.reviews.create(restaurantId, userId, dto);
  }

  @Post(':id/reply')
  reply(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: ReplyReviewDto
  ) {
    return this.reviews.reply(restaurantId, id, dto);
  }
}
