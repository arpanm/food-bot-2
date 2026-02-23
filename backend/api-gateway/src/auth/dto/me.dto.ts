import { ApiProperty } from '@nestjs/swagger';

export class JwtPayloadDto {
  @ApiProperty({ example: 'user-123' })
  sub!: string;
  @ApiProperty({ example: 1730000000 })
  exp!: number;
  @ApiProperty({ example: 1729000000 })
  iat!: number;
}
