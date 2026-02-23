import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { RecordPreferenceDto } from './dto/preference.dto';
import { PreferenceService } from './preference.service';

@Controller('users')
export class PreferenceController {
  constructor(private readonly preference: PreferenceService) {}

  @Get(':userId/context')
  getUserContext(@Param('userId') userId: string) {
    return this.preference.getUserContext(userId);
  }

  @Get(':userId/preferences')
  getPreferences(@Param('userId') userId: string) {
    return this.preference.getUserContext(userId);
  }

  @Post('preferences')
  recordPreference(@Body() dto: RecordPreferenceDto) {
    return this.preference.recordPreference(dto);
  }

  @Post(':userId/session')
  setSession(@Param('userId') userId: string, @Body() body: Record<string, unknown>) {
    return this.preference.setSession(userId, body);
  }

  @Get(':userId/session')
  getSession(@Param('userId') userId: string) {
    return this.preference.getSession(userId);
  }
}
