import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { WeatherService } from 'src/events/weather/weather.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('')
  @ApiQuery({
    name: 'afterDate',
    type: String,
    description: 'Inclusivo. Data em formato ISO',
    required: true,
  })
  @ApiQuery({
    name: 'beforeDate',
    type: String,
    description: 'Inclusivo. Data em formato ISO',
    required: false,
  })
  getAllEvents(
    @Param('afterDate') afterDate: string,
    @Param('beforeDate') beforeDate: string,
  ) {}
  @Post('') createEvent(@Query('eventData') eventData: string) {}

  @Get(':eventId') getEvent(@Query('eventId') eventId: string) {}
  @Patch(':eventId') updateEvent(@Query('eventId') eventId: string) {}
  @Delete(':eventId') deleteEvent(@Query('eventId') eventId: string) {}

  @Get(':eventId/weather')
  async getWeather(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('eventDateStringFormat') eventDateStringFormat: string,
  ) {
    return this.weatherService.getWeather(lat, lon, eventDateStringFormat);
  }
}
