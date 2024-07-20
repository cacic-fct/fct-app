import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [CacheModule.register({ ttl: 100000, max: 1 })],
  // ttl in milliseconds
  // max is max itens stored in cache
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
