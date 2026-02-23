import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Service status: ok when running' })
  status!: string;

  @ApiProperty({ example: 'api-gateway', description: 'Name of the service that responded' })
  service!: string;
}
