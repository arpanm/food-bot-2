import { Module } from '@nestjs/common';
import { IntentController } from './intent.controller';
import { IntentService } from './intent.service';
import { VectorCacheService } from './vector-cache.service';

@Module({
  controllers: [IntentController],
  providers: [IntentService, VectorCacheService],
  exports: [IntentService, VectorCacheService],
})
export class IntentModule {}
