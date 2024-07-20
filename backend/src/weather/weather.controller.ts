import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('weather')
@UseInterceptors(CacheInterceptor)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}
  @Get()
  async getWeather(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('eventDateStringFormat') eventDateStringFormat: string,
  ) {
    return this.weatherService.getWeather(lat, lon, eventDateStringFormat);
  }
}
