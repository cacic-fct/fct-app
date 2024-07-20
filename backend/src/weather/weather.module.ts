import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [CacheModule.register({ ttl: 100000, max: 1 }), HttpModule],
  // ttl in milliseconds
  // max is max itens stored in cache
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
