import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TicketsProxyController } from './tickets-proxy.controller';
import { TicketsProxyService } from './tickets-proxy.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [TicketsProxyController],
  providers: [TicketsProxyService],
})
export class TicketsProxyModule {}
