import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';

describe('OnboardingController', () => {
  let controller: OnboardingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardingController],
      providers: [OnboardingService],
    }).compile();
    controller = module.get<OnboardingController>(OnboardingController);
  });

  it('create returns restaurant', () => {
    const r = controller.create({
      name: 'Test Restaurant',
      contactEmail: 't@t.com',
      contactPhone: '1234567890',
      restaurantType: 'Multi-cuisine',
      address: 'Indiranagar',
    });
    expect(r.id).toBeDefined();
    expect(r.approvalState).toBe('pending');
  });

  it('get returns same restaurant', () => {
    const created = controller.create({
      name: 'R',
      contactEmail: 'e@e.com',
      contactPhone: '1',
      restaurantType: 'T',
      address: 'A',
    });
    const got = controller.get(created.id);
    expect(got.id).toBe(created.id);
    expect(got.name).toBe('R');
  });

  it('full flow: create -> upload -> sign -> approve', () => {
    const r = controller.create({
      name: 'Full Flow',
      contactEmail: 'f@f.com',
      contactPhone: '1',
      restaurantType: 'T',
      address: 'A',
    });
    controller.uploadDocs(r.id, {
      kycDocUrl: 'https://example.com/kyc.pdf',
      fssaiDocUrl: 'https://example.com/fssai.pdf',
    });
    controller.signContract(r.id, { signaturePayload: 'signed' });
    const approved = controller.approvalDecision(r.id, { action: 'approve' });
    expect(approved.approvalState).toBe('approved');
  });
});
