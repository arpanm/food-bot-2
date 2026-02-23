import { ApiProperty } from '@nestjs/swagger';

export class PromptRequestDto {
  @ApiProperty({
    example: 'Find me biryani near Koramangala',
    description: 'User prompt for search or order intent',
  })
  prompt!: string;
}

export class PromptResponseDto {
  @ApiProperty({ example: 'job-abc-123', description: 'Job ID to poll for status and messages' })
  jobId!: string;
}

export class ChatMessageDto {
  @ApiProperty()
  role!: string;

  @ApiProperty()
  content!: string;
}

export class JobStatusResponseDto {
  @ApiProperty({ enum: ['pending', 'completed', 'failed'], description: 'Current job status' })
  status!: 'pending' | 'completed' | 'failed';

  @ApiProperty({
    type: [ChatMessageDto],
    required: false,
    description: 'Messages when job is completed',
  })
  messages?: ChatMessageDto[];
}
