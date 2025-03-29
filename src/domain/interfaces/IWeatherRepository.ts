import type { WeatherReport } from '@/domain/models/WeatherReport';
import type { Result } from 'option-t/plain_result';

export interface IWeatherRepository {
  getWeather(
    latitude: number,
    longitude: number
  ): Promise<Result<WeatherReport, string>>;
}
