import { Injectable } from '@nestjs/common';

export type NotificationType =
  | 'order_status'
  | 'new_order'
  | 'order_at_risk'
  | 'offer'
  | 'campaign'
  | 'promotion';

export type NotificationAudience = 'customer' | 'restaurant';

export interface NotificationDto {
  id: string;
  audience: NotificationAudience;
  /** userId for customer, restaurantId for restaurant */
  recipientId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  private notifications = new Map<string, NotificationDto>();
  private nextId = 1;

  list(audience: NotificationAudience, recipientId: string): NotificationDto[] {
    return Array.from(this.notifications.values())
      .filter((n) => n.audience === audience && n.recipientId === recipientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  create(dto: Omit<NotificationDto, 'id' | 'read' | 'createdAt'>): NotificationDto {
    const id = `notif-${this.nextId++}`;
    const now = new Date().toISOString();
    const n: NotificationDto = {
      ...dto,
      id,
      read: false,
      createdAt: now,
    };
    this.notifications.set(id, n);
    return n;
  }

  markRead(id: string, audience: NotificationAudience, recipientId: string): NotificationDto | null {
    const n = this.notifications.get(id);
    if (!n || n.audience !== audience || n.recipientId !== recipientId) return null;
    n.read = true;
    return n;
  }

  markAllRead(audience: NotificationAudience, recipientId: string): number {
    let count = 0;
    this.notifications.forEach((n) => {
      if (n.audience === audience && n.recipientId === recipientId && !n.read) {
        n.read = true;
        count++;
      }
    });
    return count;
  }
}
