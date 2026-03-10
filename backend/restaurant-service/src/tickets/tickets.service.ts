import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateTicketDto, ReplyTicketDto, TicketDto, TicketMessageDto, TicketStatus, UpdateTicketStatusDto } from './dto/ticket.dto';

@Injectable()
export class TicketsService {
  private tickets = new Map<string, TicketDto & { id: string }>();
  private nextId = 1;
  private nextMsgId = 1;

  listByRestaurant(restaurantId: string): (TicketDto & { id: string })[] {
    return Array.from(this.tickets.values()).filter((t) => t.restaurantId === restaurantId);
  }

  listByUser(userId: string): (TicketDto & { id: string })[] {
    return Array.from(this.tickets.values()).filter((t) => t.userId === userId);
  }

  get(id: string): (TicketDto & { id: string }) | null {
    return this.tickets.get(id) ?? null;
  }

  create(restaurantId: string | undefined, userId: string, dto: CreateTicketDto): TicketDto & { id: string } {
    const id = `ticket-${this.nextId++}`;
    const now = new Date().toISOString();
    const msgId = `m-${this.nextMsgId++}`;
    const messages: TicketMessageDto[] = [{ id: msgId, sender: 'customer', body: dto.message, at: now }];
    const ticket: TicketDto & { id: string } = {
      id,
      restaurantId,
      userId,
      orderId: dto.orderId,
      subject: dto.subject,
      category: dto.category,
      status: 'open',
      messages,
      createdAt: now,
      updatedAt: now,
    };
    this.tickets.set(id, ticket);
    return { ...ticket };
  }

  reply(restaurantId: string | undefined, ticketId: string, sender: 'customer' | 'restaurant', dto: ReplyTicketDto): TicketDto & { id: string } {
    const t = this.tickets.get(ticketId);
    if (!t) throw new NotFoundException('Ticket not found');
    if (restaurantId != null && t.restaurantId !== restaurantId) throw new NotFoundException('Ticket not found');
    const now = new Date().toISOString();
    const msgId = `m-${this.nextMsgId++}`;
    t.messages = t.messages || [];
    t.messages.push({ id: msgId, sender, body: dto.message, at: now });
    t.updatedAt = now;
    return { ...t };
  }

  updateStatus(restaurantId: string, ticketId: string, dto: UpdateTicketStatusDto): TicketDto & { id: string } {
    const t = this.tickets.get(ticketId);
    if (!t || t.restaurantId !== restaurantId) throw new NotFoundException('Ticket not found');
    t.status = dto.status as TicketStatus;
    t.updatedAt = new Date().toISOString();
    return { ...t };
  }
}
