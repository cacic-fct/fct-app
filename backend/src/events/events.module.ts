import { Module } from '@nestjs/common';
import { WeatherModule } from 'src/events/weather/weather.module';
import { EventsController } from 'src/events/events.controller';
import { AttendanceModule } from './attendance/attendance.module';
import { EventsSubscriptionsModule } from './events-subscriptions/events-subscriptions.module';

@Module({
  controllers: [EventsController],
  imports: [WeatherModule, AttendanceModule, EventsSubscriptionsModule],
})
export class EventsModule {}
