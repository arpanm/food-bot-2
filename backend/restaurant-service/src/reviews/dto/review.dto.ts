import { IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class ReviewDto {
  id!: string;
  restaurantId!: string;
  orderId?: string;
  userId!: string;
  userName?: string;
  rating!: number;
  comment?: string;
  reply?: string;
  createdAt!: string;
  repliedAt?: string;
}

export class CreateReviewDto {
  @IsString() orderId?: string;
  @IsNumber() @Min(1) @Max(5) rating!: number;
  @IsOptional() @IsString() @MaxLength(2000) comment?: string;
}

export class ReplyReviewDto {
  @IsString() @MinLength(1) @MaxLength(1000) reply!: string;
}
