import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('weather')
@UseInterceptors(CacheInterceptor)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // @Post()
  // create(@Body() createWeatherDto: CreateWeatherDto) {
  //   return this.weatherService.create(createWeatherDto);
  // }

  // @Get()
  // findAll() {
  //   return this.weatherService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.weatherService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWeatherDto: UpdateWeatherDto) {
  //   return this.weatherService.update(+id, updateWeatherDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.weatherService.remove(+id);
  // }
}
