import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [ProfileModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
