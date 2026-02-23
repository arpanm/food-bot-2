import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { JwtPayload } from '@food-bot/types';
import { JwtPayloadDto } from './dto/me.dto';
import { User } from './user.decorator';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('me')
export class MeController {
  @Get()
  @ApiOperation({
    summary: 'Current user',
    description: 'Returns the authenticated user from JWT. Requires Bearer token.',
  })
  @ApiResponse({ status: 200, description: 'Current user', type: JwtPayloadDto })
  @ApiResponse({ status: 401, description: 'Invalid or missing token' })
  me(@User() user: JwtPayload): JwtPayloadDto {
    return { sub: user.sub, exp: user.exp, iat: user.iat };
  }
}
