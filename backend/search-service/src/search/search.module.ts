import { Module } from '@nestjs/common';
import { IndexConsumerService } from './index-consumer.service';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService, IndexConsumerService],
  exports: [SearchService],
})
export class SearchModule {}
