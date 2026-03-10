import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { NotificationsService, NotificationDto, NotificationAudience } from './notifications.service';

@Controller('notifications')
@Public()
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(
    @Query('audience') audience: NotificationAudience,
    @Query('recipientId') recipientId: string
  ) {
    if (!audience || !recipientId) return [];
    return this.notifications.list(audience, recipientId);
  }

  @Patch(':id/read')
  markRead(
    @Param('id') id: string,
    @Body() body: { audience: NotificationAudience; recipientId: string }
  ) {
    const n = this.notifications.markRead(id, body.audience, body.recipientId);
    return n ? { ok: true } : { ok: false };
  }

  @Post('mark-all-read')
  markAllRead(@Body() body: { audience: NotificationAudience; recipientId: string }) {
    const count = this.notifications.markAllRead(body.audience, body.recipientId);
    return { count };
  }

  @Post()
  create(@Body() dto: Omit<NotificationDto, 'id' | 'read' | 'createdAt'>) {
    return this.notifications.create(dto);
  }
}
