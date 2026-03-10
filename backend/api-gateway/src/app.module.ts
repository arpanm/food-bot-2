import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthController } from './auth/auth.controller';
import { MeController } from './auth/me.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { ChatController, JobsController } from './chat.controller';
import { OrdersController } from './orders.controller';
import { RestaurantsController } from './restaurants.controller';
import { NotificationsModule } from './notifications/notifications.module';
import { OrderProxyModule } from './order-proxy/order-proxy.module';
import { SearchController } from './search.controller';
import { TicketsProxyModule } from './tickets-proxy/tickets-proxy.module';
import { WorkflowProxyModule } from './workflow-proxy/workflow-proxy.module';

@Module({
  imports: [
    OrderProxyModule,
    NotificationsModule,
    TicketsProxyModule,
    WorkflowProxyModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 100 },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    MeController,
    ChatController,
    JobsController,
    RestaurantsController,
    OrdersController,
    SearchController,
  ],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
