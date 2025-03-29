import type { IWeatherRepository } from '@/domain/interfaces/IWeatherRepository';
import type { WeatherReport } from '@/domain/models/WeatherReport';
import type { Result } from 'option-t/plain_result';

export class FetchHistoricalWeather {
  constructor(private readonly weatherRepository: IWeatherRepository) {}

  async execute(
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string
  ): Promise<Result<WeatherReport, string>> {
    return this.weatherRepository.getWeather(
      latitude,
      longitude,
      startDate,
      endDate
    );
  }
}
