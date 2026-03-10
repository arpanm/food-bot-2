import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { TicketsProxyService } from './tickets-proxy.service';

@Controller('tickets')
@Public()
export class TicketsProxyController {
  constructor(private readonly proxy: TicketsProxyService) {}

  private userId(@Req() req: { headers: { authorization?: string } }) {
    return this.proxy.getUserId(req.headers.authorization);
  }

  @Get()
  list(@Req() req: { headers: { authorization?: string } }) {
    return this.proxy.listTickets(this.userId(req));
  }

  @Get(':id')
  get(@Req() req: { headers: { authorization?: string } }, @Param('id') id: string) {
    return this.proxy.getTicket(this.userId(req), id);
  }

  @Post()
  create(
    @Req() req: { headers: { authorization?: string } },
    @Body() dto: { subject: string; category: string; message: string; restaurantId?: string }
  ) {
    return this.proxy.createTicket(this.userId(req), dto);
  }

  @Post(':id/reply')
  reply(
    @Req() req: { headers: { authorization?: string } },
    @Param('id') id: string,
    @Body() dto: { message: string }
  ) {
    return this.proxy.replyTicket(this.userId(req), id, dto);
  }
}
