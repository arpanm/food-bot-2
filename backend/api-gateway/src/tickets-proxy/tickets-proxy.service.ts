import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';

@Injectable()
export class TicketsProxyService {
  constructor(private readonly jwt: JwtService) {}

  getUserId(authHeader?: string): string {
    if (!authHeader?.startsWith('Bearer ')) return 'anonymous';
    try {
      const token = authHeader.slice(7).trim();
      if (!token) return 'anonymous';
      const payload = this.jwt.verify<{ sub?: string }>(token);
      return payload?.sub && typeof payload.sub === 'string' ? payload.sub : 'anonymous';
    } catch {
      return 'anonymous';
    }
  }

  private async forward(method: string, path: string, userId: string, body?: unknown): Promise<unknown> {
    const url = `${RESTAURANT_SERVICE_URL.replace(/\/$/, '')}${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    if (!res.ok) throw new HttpException(text || `Tickets proxy ${res.status}`, res.status);
    if (!text) return undefined;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  async listTickets(userId: string) {
    return this.forward('GET', '/tickets', userId);
  }

  async getTicket(userId: string, ticketId: string) {
    return this.forward('GET', `/tickets/${ticketId}`, userId);
  }

  async createTicket(userId: string, dto: { subject: string; category: string; message: string; restaurantId?: string }) {
    return this.forward('POST', '/tickets', userId, dto);
  }

  async replyTicket(userId: string, ticketId: string, dto: { message: string }) {
    return this.forward('POST', `/tickets/${ticketId}/reply`, userId, dto);
  }
}
