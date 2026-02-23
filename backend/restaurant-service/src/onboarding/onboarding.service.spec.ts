import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingService } from './onboarding.service';

describe('OnboardingService', () => {
  let service: OnboardingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnboardingService],
    }).compile();
    service = module.get<OnboardingService>(OnboardingService);
  });

  it('create returns restaurant with pending state', () => {
    const r = service.create({
      name: 'Biryani House',
      contactEmail: 'b@b.com',
      contactPhone: '9876543210',
      restaurantType: 'North Indian',
      address: 'Koramangala',
    });
    expect(r.id).toBeDefined();
    expect(r.name).toBe('Biryani House');
    expect(r.approvalState).toBe('pending');
  });

  it('get throws NotFound for unknown id', () => {
    expect(() => service.getOrThrow('rest-999')).toThrow(NotFoundException);
  });

  it('uploadDocs sets urls and moves to documents_submitted when both provided', () => {
    const r = service.create({
      name: 'B',
      contactEmail: 'b@b.com',
      contactPhone: '1',
      restaurantType: 'T',
      address: 'A',
    });
    let updated = service.uploadDocs(r.id, { kycDocUrl: 'https://example.com/kyc.pdf' });
    expect(updated.approvalState).toBe('pending');
    updated = service.uploadDocs(r.id, { fssaiDocUrl: 'https://example.com/fssai.pdf' });
    expect(updated.kycDocUrl).toBeDefined();
    expect(updated.fssaiDocUrl).toBeDefined();
    expect(updated.approvalState).toBe('documents_submitted');
  });

  it('signContract moves to contract_signed', () => {
    const r = service.create({
      name: 'B',
      contactEmail: 'b@b.com',
      contactPhone: '1',
      restaurantType: 'T',
      address: 'A',
    });
    service.uploadDocs(r.id, { kycDocUrl: 'https://a.com/k', fssaiDocUrl: 'https://a.com/f' });
    const signed = service.signContract(r.id, { signaturePayload: 'signed-v1' });
    expect(signed.approvalState).toBe('contract_signed');
    expect(signed.contractSignedAt).toBeDefined();
  });

  it('approvalDecision approve sets approved', () => {
    const r = service.create({
      name: 'B',
      contactEmail: 'b@b.com',
      contactPhone: '1',
      restaurantType: 'T',
      address: 'A',
    });
    service.uploadDocs(r.id, { kycDocUrl: 'https://a.com/k', fssaiDocUrl: 'https://a.com/f' });
    service.signContract(r.id, { signaturePayload: 'signed' });
    const approved = service.approvalDecision(r.id, { action: 'approve' });
    expect(approved.approvalState).toBe('approved');
    expect(approved.approvedAt).toBeDefined();
  });

  it('approvalDecision reject sets rejected', () => {
    const r = service.create({
      name: 'B',
      contactEmail: 'b@b.com',
      contactPhone: '1',
      restaurantType: 'T',
      address: 'A',
    });
    service.uploadDocs(r.id, { kycDocUrl: 'https://a.com/k', fssaiDocUrl: 'https://a.com/f' });
    service.signContract(r.id, { signaturePayload: 'signed' });
    const rejected = service.approvalDecision(r.id, { action: 'reject', reason: 'Invalid docs' });
    expect(rejected.approvalState).toBe('rejected');
    expect(rejected.rejectedReason).toBe('Invalid docs');
  });
});
