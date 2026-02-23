import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { IntentModule } from './intent/intent.module';

@Module({
  imports: [IntentModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
