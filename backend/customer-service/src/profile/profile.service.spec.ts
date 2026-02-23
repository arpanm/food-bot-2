import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileService],
    }).compile();
    service = module.get<ProfileService>(ProfileService);
  });

  it('getOrCreateProfile returns new profile for new userId', () => {
    const p = service.getOrCreateProfile('user-1');
    expect(p.userId).toBe('user-1');
    expect(p.selectedAddressId).toBeNull();
  });

  it('updateProfile updates displayName and email', () => {
    service.getOrCreateProfile('user-1');
    const updated = service.updateProfile('user-1', {
      displayName: 'Alice',
      email: 'alice@example.com',
    });
    expect(updated.displayName).toBe('Alice');
    expect(updated.email).toBe('alice@example.com');
  });

  it('createAddress adds address and listAddresses returns it', () => {
    const addr = service.createAddress('user-1', {
      label: 'Home',
      line1: '123 Main St',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    });
    expect(addr.id).toBeDefined();
    expect(addr.userId).toBe('user-1');
    expect(addr.label).toBe('Home');
    expect(addr.pincode).toBe('560001');
    const list = service.listAddresses('user-1');
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(addr.id);
  });

  it('updateAddress modifies address', () => {
    const addr = service.createAddress('user-1', {
      label: 'Home',
      line1: '123 Main St',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    });
    const updated = service.updateAddress('user-1', addr.id!, { label: 'Work', pincode: '560002' });
    expect(updated.label).toBe('Work');
    expect(updated.pincode).toBe('560002');
    expect(updated.line1).toBe('123 Main St');
  });

  it('updateAddress throws NotFound for wrong user', () => {
    const addr = service.createAddress('user-1', {
      label: 'Home',
      line1: '123 Main St',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    });
    expect(() => service.updateAddress('user-2', addr.id!, { label: 'Other' })).toThrow(
      NotFoundException
    );
  });

  it('deleteAddress removes address and clears selectedAddressId', () => {
    const addr = service.createAddress('user-1', {
      label: 'Home',
      line1: '123 Main St',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    });
    service.updateProfile('user-1', { selectedAddressId: addr.id! });
    service.deleteAddress('user-1', addr.id!);
    expect(service.listAddresses('user-1')).toHaveLength(0);
    const profile = service.getOrCreateProfile('user-1');
    expect(profile.selectedAddressId).toBeNull();
  });

  it('selectAddressForCart sets selectedAddressId', () => {
    const addr = service.createAddress('user-1', {
      label: 'Home',
      line1: '123 Main St',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    });
    const profile = service.selectAddressForCart('user-1', addr.id!);
    expect(profile.selectedAddressId).toBe(addr.id);
  });

  it('updateProfile selectedAddressId validates address exists', () => {
    service.getOrCreateProfile('user-1');
    expect(() =>
      service.updateProfile('user-1', { selectedAddressId: 'addr-nonexistent' })
    ).toThrow(NotFoundException);
  });
});
