import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  ApprovalDecisionDto,
  CreateRestaurantDto,
  RestaurantDto,
  SignContractDto,
  UploadDocsDto,
} from './dto/onboarding.dto';

@Injectable()
export class OnboardingService {
  private restaurants = new Map<string, RestaurantDto>();
  private nextId = 1;

  create(dto: CreateRestaurantDto): RestaurantDto {
    const id = `rest-${this.nextId++}`;
    const r: RestaurantDto = {
      id,
      name: dto.name,
      contactEmail: dto.contactEmail,
      contactPhone: dto.contactPhone,
      restaurantType: dto.restaurantType,
      address: dto.address,
      approvalState: 'pending',
    };
    this.restaurants.set(id, r);
    return { ...r };
  }

  get(id: string): RestaurantDto | null {
    return this.restaurants.get(id) ?? null;
  }

  getOrThrow(id: string): RestaurantDto {
    const r = this.get(id);
    if (!r) throw new NotFoundException('Restaurant not found');
    return r;
  }

  uploadDocs(id: string, dto: UploadDocsDto): RestaurantDto {
    const r = this.getOrThrow(id);
    if (r.approvalState !== 'pending') {
      throw new Error('Can only upload docs when state is pending');
    }
    if (dto.kycDocUrl) r.kycDocUrl = dto.kycDocUrl;
    if (dto.fssaiDocUrl) r.fssaiDocUrl = dto.fssaiDocUrl;
    if (r.kycDocUrl && r.fssaiDocUrl) r.approvalState = 'documents_submitted';
    this.restaurants.set(id, r);
    return { ...r };
  }

  signContract(id: string, _dto: SignContractDto): RestaurantDto {
    const r = this.getOrThrow(id);
    if (r.approvalState !== 'documents_submitted') {
      throw new Error('Sign contract only after documents submitted');
    }
    r.contractSignedAt = new Date().toISOString();
    r.approvalState = 'contract_signed';
    this.restaurants.set(id, r);
    return { ...r };
  }

  approvalDecision(id: string, dto: ApprovalDecisionDto): RestaurantDto {
    const r = this.getOrThrow(id);
    if (r.approvalState !== 'contract_signed') {
      throw new Error('Only contract_signed restaurants can be approved/rejected');
    }
    if (dto.action === 'approve') {
      r.approvalState = 'approved';
      r.approvedAt = new Date().toISOString();
      r.rejectedReason = undefined;
    } else {
      r.approvalState = 'rejected';
      r.rejectedReason = dto.reason ?? 'No reason provided';
    }
    this.restaurants.set(id, r);
    return { ...r };
  }
}
