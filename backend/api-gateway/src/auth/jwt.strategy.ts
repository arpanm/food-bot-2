import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '@food-bot/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: { sub: string; exp: number; iat: number }): JwtPayload {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      sub: payload.sub,
      exp: payload.exp,
      iat: payload.iat,
    };
  }
}
