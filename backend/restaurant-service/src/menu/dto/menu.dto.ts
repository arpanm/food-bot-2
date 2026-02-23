import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';

export class MenuItemDto {
  id!: string;
  restaurantId!: string;
  name!: string;
  description?: string;
  category!: string;
  priceCents!: number;
  available!: boolean;
}

export class CreateMenuItemDto {
  @IsString() @MinLength(1) @MaxLength(200) name!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsString() @MinLength(1) @MaxLength(100) category!: string;
  @IsNumber() @Min(0) priceCents!: number;
  @IsOptional() @IsBoolean() available?: boolean;
}

export class UpdateMenuItemDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(200) name?: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) category?: string;
  @IsOptional() @IsNumber() @Min(0) priceCents?: number;
  @IsOptional() @IsBoolean() available?: boolean;
}
