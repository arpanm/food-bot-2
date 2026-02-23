import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AddressDto {
  id?: string;
  userId!: string;
  label!: string;
  line1!: string;
  line2?: string;
  city!: string;
  state!: string;
  pincode!: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
}

export class CreateAddressDto {
  @IsString() @MinLength(1) @MaxLength(50) label!: string;
  @IsString() @MinLength(1) @MaxLength(200) line1!: string;
  @IsOptional() @IsString() @MaxLength(200) line2?: string;
  @IsString() @MinLength(1) @MaxLength(100) city!: string;
  @IsString() @MinLength(1) @MaxLength(100) state!: string;
  @IsString() @MinLength(5) @MaxLength(10) pincode!: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
}

export class UpdateAddressDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(50) label?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(200) line1?: string;
  @IsOptional() @IsString() @MaxLength(200) line2?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) city?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) state?: string;
  @IsOptional() @IsString() @MinLength(5) @MaxLength(10) pincode?: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
}
