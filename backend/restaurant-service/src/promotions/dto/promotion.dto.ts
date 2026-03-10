import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export type PromotionType = 'percent_off' | 'amount_off' | 'bogo' | 'combo';

export class PromotionDto {
  id!: string;
  restaurantId!: string;
  name!: string;
  type!: PromotionType;
  valueCents?: number;
  valuePercent?: number;
  minOrderCents?: number;
  code?: string;
  startAt!: string;
  endAt!: string;
  active!: boolean;
  createdAt!: string;
}

export class CreatePromotionDto {
  @IsString() @MinLength(1) @MaxLength(200) name!: string;
  @IsString() type!: PromotionType;
  @IsOptional() @IsNumber() @Min(0) valueCents?: number;
  @IsOptional() @IsNumber() @Min(0) valuePercent?: number;
  @IsOptional() @IsNumber() @Min(0) minOrderCents?: number;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsString() startAt!: string;
  @IsString() endAt!: string;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class UpdatePromotionDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(200) name?: string;
  @IsOptional() @IsString() type?: PromotionType;
  @IsOptional() @IsNumber() @Min(0) valueCents?: number;
  @IsOptional() @IsNumber() @Min(0) valuePercent?: number;
  @IsOptional() @IsNumber() @Min(0) minOrderCents?: number;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsOptional() @IsString() startAt?: string;
  @IsOptional() @IsString() endAt?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}
