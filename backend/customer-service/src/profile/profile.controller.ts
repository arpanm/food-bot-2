import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateAddressDto, UpdateAddressDto, UpdateProfileDto } from './dto';
import { ProfileService } from './profile.service';

const X_USER_ID = 'x-user-id';

function uid(header?: string): string {
  return header && header.trim() ? header.trim() : 'anonymous';
}

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Headers(X_USER_ID) xUserId?: string) {
    return this.profileService.getOrCreateProfile(uid(xUserId));
  }

  @Patch()
  updateProfile(@Headers(X_USER_ID) xUserId: string | undefined, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(uid(xUserId), dto);
  }
}

@Controller('addresses')
export class AddressesController {
  constructor(private readonly profileService: ProfileService) {}

  private getUid(header?: string): string {
    return uid(header);
  }

  @Get()
  list(@Headers(X_USER_ID) xUserId?: string) {
    return this.profileService.listAddresses(this.getUid(xUserId));
  }

  @Post()
  create(@Headers(X_USER_ID) xUserId: string | undefined, @Body() dto: CreateAddressDto) {
    return this.profileService.createAddress(this.getUid(xUserId), dto);
  }

  @Get(':id')
  get(@Headers(X_USER_ID) xUserId: string | undefined, @Param('id') id: string) {
    const a = this.profileService.getAddress(this.getUid(xUserId), id);
    if (!a) throw new NotFoundException('Address not found');
    return a;
  }

  @Patch(':id')
  update(
    @Headers(X_USER_ID) xUserId: string | undefined,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto
  ) {
    return this.profileService.updateAddress(this.getUid(xUserId), id, dto);
  }

  @Delete(':id')
  delete(@Headers(X_USER_ID) xUserId: string | undefined, @Param('id') id: string) {
    this.profileService.deleteAddress(this.getUid(xUserId), id);
  }

  @Post(':id/select-for-cart')
  selectForCart(@Headers(X_USER_ID) xUserId: string | undefined, @Param('id') id: string) {
    return this.profileService.selectAddressForCart(this.getUid(xUserId), id);
  }
}
