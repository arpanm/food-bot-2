import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JobModule } from './job/job.module';

@Module({
  imports: [JobModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
