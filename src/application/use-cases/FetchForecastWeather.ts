import type { IWeatherRepository } from '@/domain/interfaces/IWeatherRepository';
import type { WeatherReport } from '@/domain/models/WeatherReport';
import type { Result } from 'option-t/plain_result';

export class FetchForecastWeather {
  constructor(private readonly weatherRepository: IWeatherRepository) {}

  async execute(
    latitude: number,
    longitude: number
  ): Promise<Result<WeatherReport, string>> {
    return this.weatherRepository.getWeather(latitude, longitude);
  }
}
