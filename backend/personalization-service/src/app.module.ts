import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PreferenceModule } from './preference/preference.module';

@Module({
  imports: [PreferenceModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
