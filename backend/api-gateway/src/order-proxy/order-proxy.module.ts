import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrderProxyController } from './order-proxy.controller';
import { OrderProxyService } from './order-proxy.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [OrderProxyController],
  providers: [OrderProxyService],
})
export class OrderProxyModule {}
