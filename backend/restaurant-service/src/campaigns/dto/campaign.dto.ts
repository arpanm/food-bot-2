import { IsArray, IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export type CampaignChannel = 'banner' | 'push' | 'whatsapp' | 'sms' | 'email' | 'facebook_ads' | 'instagram_ads';

export class CampaignDto {
  id!: string;
  restaurantId!: string;
  name!: string;
  title!: string;
  body!: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
  segmentId?: string;
  channels!: CampaignChannel[];
  startAt!: string;
  endAt!: string;
  active!: boolean;
  createdAt!: string;
}

export class CreateCampaignDto {
  @IsString() @MinLength(1) @MaxLength(200) name!: string;
  @IsString() @MinLength(1) @MaxLength(200) title!: string;
  @IsString() @MaxLength(2000) body!: string;
  @IsOptional() @IsString() @MaxLength(100) ctaLabel?: string;
  @IsOptional() @IsString() @MaxLength(500) ctaUrl?: string;
  @IsOptional() @IsString() @MaxLength(2000) imageUrl?: string;
  @IsOptional() @IsString() segmentId?: string;
  @IsArray() channels!: CampaignChannel[];
  @IsString() startAt!: string;
  @IsString() endAt!: string;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class UpdateCampaignDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(200) name?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(200) title?: string;
  @IsOptional() @IsString() @MaxLength(2000) body?: string;
  @IsOptional() @IsString() @MaxLength(100) ctaLabel?: string;
  @IsOptional() @IsString() @MaxLength(500) ctaUrl?: string;
  @IsOptional() @IsString() @MaxLength(2000) imageUrl?: string;
  @IsOptional() @IsString() segmentId?: string;
  @IsOptional() @IsArray() channels?: CampaignChannel[];
  @IsOptional() @IsString() startAt?: string;
  @IsOptional() @IsString() endAt?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class SegmentDto {
  id!: string;
  restaurantId!: string;
  name!: string;
  description?: string;
  rule?: string;
  createdAt!: string;
}
