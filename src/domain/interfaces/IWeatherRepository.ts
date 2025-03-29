import type { IWeather } from '@/domain/interfaces/IWeather';
import type { Result } from 'option-t/plain_result';

export interface IWeatherRepository {
  getWeather(
    latitude: number,
    longitude: number
  ): Promise<Result<IWeather[], string>>;
}
