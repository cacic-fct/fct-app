import { Module } from '@nestjs/common';
import { WeatherModule } from 'src/events/weather/weather.module';

@Module({
  imports: [WeatherModule],
})
export class EventsModule {}
