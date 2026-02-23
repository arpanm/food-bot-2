import { Module } from '@nestjs/common';
import { AddressesController, ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController, AddressesController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
