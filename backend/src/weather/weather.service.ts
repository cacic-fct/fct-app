import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
    weathercode: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
}

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  WeatherCodesList = {
    0: { icon: 'sunny', icon_night: 'moon', text: 'Céu limpo' },
    1: {
      icon: 'sunny',
      icon_night: 'moon',
      text: 'Céu predominantemente limpo',
    },
    2: {
      icon: 'partly-sunny',
      icon_night: 'cloudy-night',
      text: 'Predominantemente nublado',
    },
    3: { icon: 'cloudy', text: 'Nublado' },
    45: { icon: 'cloudy', text: 'Neblina' },
    48: { icon: 'cloudy', text: 'Neblina' },
    51: { icon: 'rainy', text: 'Garoa leve' },
    53: { icon: 'rainy', text: 'Garoa' },
    55: { icon: 'rainy', text: 'Garoa intensa' },
    56: { icon: 'rainy', text: 'Garoa congelante leve' },
    57: { icon: 'rainy', text: 'Garoa congelante' },
    61: { icon: 'rainy', text: 'Chuva leve' },
    63: { icon: 'rainy', text: 'Chuva' },
    65: { icon: 'rainy', text: 'Chuva intensa' },
    66: { icon: 'rainy', text: 'Chuva congelante leve' },
    67: { icon: 'rainy', text: 'Chuva congelante' },
    71: { icon: 'snow', text: 'Neve leve' },
    73: { icon: 'snow', text: 'Neve' },
    75: { icon: 'snow', text: 'Neve intensa' },
    77: { icon: 'snow', text: 'Neve granular' },
    80: { icon: 'rainy', text: 'Pancada leve de chuva' },
    81: { icon: 'rainy', text: 'Pancada de chuva' },
    82: { icon: 'rainy', text: 'Pancada intensa de chuva' },
    85: { icon: 'snow', text: 'Pancada de neve' },
    86: { icon: 'snow', text: 'Pancada intensa de neve' },
    95: { icon: 'thunderstorm', text: 'Trovoada' },
    96: { icon: 'thunderstorm', text: 'Trovoada' },
    99: { icon: 'thunderstorm', text: 'Trovoada' },
  };

  async getWeather(lat: number, lon: number, eventDateStringFormat: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<WeatherData>(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&timezone=America%2FSao_Paulo&start_date=${eventDateStringFormat}&end_date=${eventDateStringFormat}`,
      ),
    );
    return this.WeatherCodesList[data.hourly.weathercode[0]];
  }
}
