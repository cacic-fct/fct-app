import { Module } from '@nestjs/common';
import { WeatherModule } from 'src/events/weather/weather.module';
import { DeleteService } from './management/delete/delete.service';
import { CreateService } from './management/create/create.service';
import { UpdateService } from './management/update/update.service';
import { EventsController } from 'src/events/events.controller';

@Module({
  controllers: [EventsController],
  imports: [WeatherModule],
  providers: [DeleteService, CreateService, UpdateService],
})
export class EventsModule {}
