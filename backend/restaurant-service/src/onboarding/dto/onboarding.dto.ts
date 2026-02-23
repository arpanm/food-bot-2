import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export type ApprovalState =
  | 'pending'
  | 'documents_submitted'
  | 'contract_signed'
  | 'approved'
  | 'rejected';

export class CreateRestaurantDto {
  @IsString() @MinLength(1) @MaxLength(200) name!: string;
  @IsString() @MinLength(1) @MaxLength(100) contactEmail!: string;
  @IsString() @MinLength(1) @MaxLength(20) contactPhone!: string;
  @IsString() @MinLength(1) @MaxLength(100) restaurantType!: string; // e.g. "North Indian", "Multi-cuisine"
  @IsString() @MinLength(1) @MaxLength(300) address!: string;
}

export class RestaurantDto {
  id!: string;
  name!: string;
  contactEmail!: string;
  contactPhone!: string;
  restaurantType!: string;
  address!: string;
  approvalState!: ApprovalState;
  kycDocUrl?: string;
  fssaiDocUrl?: string;
  contractSignedAt?: string; // ISO date
  approvedAt?: string;
  rejectedReason?: string;
}

export class UploadDocsDto {
  @IsOptional() @IsUrl() kycDocUrl?: string;
  @IsOptional() @IsUrl() fssaiDocUrl?: string;
}

export class SignContractDto {
  @IsString() @MinLength(1) signaturePayload!: string; // e.g. base64 or agreed terms hash
}

export class ApprovalDecisionDto {
  @IsString() action!: 'approve' | 'reject';
  @IsOptional() @IsString() @MaxLength(500) reason?: string;
}
