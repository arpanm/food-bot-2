import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';
import { HealthResponseDto } from './dto/health.dto';

@ApiTags('Health')
@Controller()
@Public()
export class AppController {
  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns service health status. Use for liveness/readiness probes.',
  })
  @ApiResponse({ status: 200, description: 'Service is healthy', type: HealthResponseDto })
  health(): HealthResponseDto {
    return { status: 'ok', service: 'api-gateway' };
  }
}
