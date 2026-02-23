import { Body, Controller, Post } from '@nestjs/common';
import type { IntentRequestDto } from './dto/intent.dto';
import { IntentService } from './intent.service';

@Controller('intent')
export class IntentController {
  constructor(private readonly intent: IntentService) {}

  @Post()
  getIntentAndWorkflow(@Body() dto: IntentRequestDto) {
    return this.intent.getIntentAndWorkflow(dto);
  }
}
