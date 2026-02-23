import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  AddressDto,
  CreateAddressDto,
  ProfileDto,
  UpdateAddressDto,
  UpdateProfileDto,
} from './dto';

@Injectable()
export class ProfileService {
  private profiles = new Map<string, ProfileDto>();
  private addresses = new Map<string, AddressDto & { id: string }>();
  private nextAddressId = 1;

  getProfile(userId: string): ProfileDto | null {
    return this.profiles.get(userId) ?? null;
  }

  getOrCreateProfile(userId: string): ProfileDto {
    let p = this.profiles.get(userId);
    if (!p) {
      p = { userId, selectedAddressId: null };
      this.profiles.set(userId, p);
    }
    return { ...p };
  }

  updateProfile(userId: string, dto: UpdateProfileDto): ProfileDto {
    const p = this.getOrCreateProfile(userId);
    if (dto.displayName !== undefined) p.displayName = dto.displayName;
    if (dto.email !== undefined) p.email = dto.email;
    if (dto.phone !== undefined) p.phone = dto.phone;
    if (dto.selectedAddressId !== undefined) {
      if (dto.selectedAddressId && !this.addresses.has(dto.selectedAddressId)) {
        throw new NotFoundException('Address not found');
      }
      p.selectedAddressId = dto.selectedAddressId ?? null;
    }
    this.profiles.set(userId, p);
    return { ...p };
  }

  listAddresses(userId: string): (AddressDto & { id: string })[] {
    return Array.from(this.addresses.values()).filter((a) => a.userId === userId);
  }

  getAddress(userId: string, addressId: string): (AddressDto & { id: string }) | null {
    const a = this.addresses.get(addressId);
    return a && a.userId === userId ? a : null;
  }

  createAddress(userId: string, dto: CreateAddressDto): AddressDto & { id: string } {
    const id = `addr-${this.nextAddressId++}`;
    const addr: AddressDto & { id: string } = {
      id,
      userId,
      label: dto.label,
      line1: dto.line1,
      line2: dto.line2,
      city: dto.city,
      state: dto.state,
      pincode: dto.pincode,
      phone: dto.phone,
    };
    this.addresses.set(id, addr);
    return { ...addr };
  }

  updateAddress(
    userId: string,
    addressId: string,
    dto: UpdateAddressDto
  ): AddressDto & { id: string } {
    const a = this.getAddress(userId, addressId);
    if (!a) throw new NotFoundException('Address not found');
    if (dto.label !== undefined) a.label = dto.label;
    if (dto.line1 !== undefined) a.line1 = dto.line1;
    if (dto.line2 !== undefined) a.line2 = dto.line2;
    if (dto.city !== undefined) a.city = dto.city;
    if (dto.state !== undefined) a.state = dto.state;
    if (dto.pincode !== undefined) a.pincode = dto.pincode;
    if (dto.phone !== undefined) a.phone = dto.phone;
    this.addresses.set(addressId, a);
    return { ...a };
  }

  deleteAddress(userId: string, addressId: string): void {
    const a = this.getAddress(userId, addressId);
    if (!a) throw new NotFoundException('Address not found');
    this.addresses.delete(addressId);
    const profile = this.profiles.get(userId);
    if (profile?.selectedAddressId === addressId) {
      profile.selectedAddressId = null;
      this.profiles.set(userId, profile);
    }
  }

  selectAddressForCart(userId: string, addressId: string): ProfileDto {
    return this.updateProfile(userId, { selectedAddressId: addressId });
  }
}
