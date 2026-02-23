import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { Public } from './public.decorator';

@ApiTags('Auth')
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly jwt: JwtService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login (stub)',
    description: 'Returns a JWT for the given email. For dev/demo only.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string' }, password: { type: 'string' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Returns accessToken' })
  login(@Body() body: { email?: string; password?: string }) {
    const sub = body.email && body.email.trim() ? body.email.trim() : 'anonymous';
    const payload = { sub };
    const accessToken = this.jwt.sign(payload);
    return { accessToken };
  }
}
