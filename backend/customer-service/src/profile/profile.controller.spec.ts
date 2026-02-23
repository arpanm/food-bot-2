import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController, ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [ProfileService],
    }).compile();
    controller = module.get<ProfileController>(ProfileController);
  });

  it('getProfile returns default profile for anonymous', () => {
    const p = controller.getProfile(undefined);
    expect(p.userId).toBe('anonymous');
    expect(p.selectedAddressId).toBeNull();
  });

  it('getProfile returns profile for x-user-id', () => {
    const p = controller.getProfile('user-1');
    expect(p.userId).toBe('user-1');
  });

  it('updateProfile updates and returns profile', () => {
    controller.updateProfile('user-1', { displayName: 'Bob', email: 'bob@test.com' });
    const p = controller.getProfile('user-1');
    expect(p.displayName).toBe('Bob');
    expect(p.email).toBe('bob@test.com');
  });
});

describe('AddressesController', () => {
  let controller: AddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [ProfileService],
    }).compile();
    controller = module.get<AddressesController>(AddressesController);
  });

  const uid = 'user-1';

  it('list returns empty array initially', () => {
    expect(controller.list(uid)).toEqual([]);
  });

  it('create returns address with id', () => {
    const addr = controller.create(uid, {
      label: 'Home',
      line1: '123 St',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    });
    expect(addr.id).toBeDefined();
    expect(addr.label).toBe('Home');
    expect(controller.list(uid)).toHaveLength(1);
  });

  it('get returns address by id', () => {
    const created = controller.create(uid, {
      label: 'Office',
      line1: '456 Ave',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560002',
    });
    const got = controller.get(uid, created.id!);
    expect(got.id).toBe(created.id);
    expect(got.label).toBe('Office');
  });

  it('get throws NotFound for unknown id', () => {
    expect(() => controller.get(uid, 'addr-999')).toThrow(NotFoundException);
  });

  it('update modifies address', () => {
    const created = controller.create(uid, {
      label: 'Home',
      line1: '123 St',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    });
    const updated = controller.update(uid, created.id!, { label: 'Work' });
    expect(updated.label).toBe('Work');
  });

  it('delete removes address', () => {
    const created = controller.create(uid, {
      label: 'Home',
      line1: '123 St',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    });
    controller.delete(uid, created.id!);
    expect(controller.list(uid)).toHaveLength(0);
    expect(() => controller.get(uid, created.id!)).toThrow(NotFoundException);
  });

  it('selectForCart sets selectedAddressId on profile', () => {
    const created = controller.create(uid, {
      label: 'Home',
      line1: '123 St',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    });
    const profile = controller.selectForCart(uid, created.id!);
    expect(profile.selectedAddressId).toBe(created.id);
  });
});
