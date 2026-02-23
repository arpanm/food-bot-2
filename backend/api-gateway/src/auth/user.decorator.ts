import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '@food-bot/types';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext): JwtPayload => {
  const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
  return request.user;
});
