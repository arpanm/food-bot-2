import { Module } from '@nestjs/common';
import { CustomerTicketsController, RestaurantTicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  controllers: [RestaurantTicketsController, CustomerTicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
