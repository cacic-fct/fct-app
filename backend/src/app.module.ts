import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [WeatherModule, ConfigModule.forRoot(), AuthModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
