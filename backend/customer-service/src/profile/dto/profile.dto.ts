import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ProfileDto {
  id?: string;
  userId!: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(200) displayName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  selectedAddressId?: string | null;
}

export class UpdateProfileDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(200) displayName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  @IsOptional() selectedAddressId?: string | null;
}
