import { Body, Controller, Get, Headers, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { CreateTicketDto, ReplyTicketDto, UpdateTicketStatusDto } from './dto/ticket.dto';
import { TicketsService } from './tickets.service';

const X_USER_ID = 'x-user-id';

@Controller('restaurants/:restaurantId/tickets')
export class RestaurantTicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get()
  list(@Param('restaurantId') restaurantId: string) {
    return this.tickets.listByRestaurant(restaurantId);
  }

  @Get(':id')
  get(@Param('restaurantId') restaurantId: string, @Param('id') id: string) {
    const t = this.tickets.get(id);
    if (!t || t.restaurantId !== restaurantId) throw new NotFoundException('Ticket not found');
    return t;
  }

  @Post(':id/reply')
  reply(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: ReplyTicketDto
  ) {
    return this.tickets.reply(restaurantId, id, 'restaurant', dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTicketStatusDto
  ) {
    return this.tickets.updateStatus(restaurantId, id, dto);
  }
}

@Controller('tickets')
export class CustomerTicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get()
  list(@Headers(X_USER_ID) xUserId: string | undefined) {
    const userId = xUserId?.trim() || 'anonymous';
    return this.tickets.listByUser(userId);
  }

  @Get(':id')
  get(@Headers(X_USER_ID) xUserId: string | undefined, @Param('id') id: string) {
    const userId = xUserId?.trim() || 'anonymous';
    const t = this.tickets.get(id);
    if (!t || t.userId !== userId) throw new NotFoundException('Ticket not found');
    return t;
  }

  @Post()
  create(
    @Body() dto: CreateTicketDto & { restaurantId?: string },
    @Headers(X_USER_ID) xUserId: string | undefined
  ) {
    const userId = xUserId?.trim() || 'anonymous';
    return this.tickets.create(dto.restaurantId, userId, dto);
  }

  @Post(':id/reply')
  reply(
    @Param('id') id: string,
    @Headers(X_USER_ID) xUserId: string | undefined,
    @Body() dto: ReplyTicketDto
  ) {
    const userId = xUserId?.trim() || 'anonymous';
    const t = this.tickets.get(id);
    if (!t || t.userId !== userId) throw new NotFoundException('Ticket not found');
    return this.tickets.reply(t.restaurantId, id, 'customer', dto);
  }
}
