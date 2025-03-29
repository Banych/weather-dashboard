import HistoricalWeatherClient from '@/domain/clients/HistoricalWeatherClient';
import type { WeatherDTO, WeatherUnitsDTO } from '@/domain/dto/WeatherDTO';
import type { IWeatherRepository } from '@/domain/interfaces/IWeatherRepository';
import { WeatherReport } from '@/domain/models/WeatherReport';
import { AxiosError } from 'axios';
import { isDate } from 'date-fns';
import { createErr, createOk, type Result } from 'option-t/plain_result';

export class HistoricalWeatherRepository implements IWeatherRepository {
  async getWeather(
    latitude: number,
    longitude: number,
    startDate?: string,
    endDate?: string
  ): Promise<Result<WeatherReport, string>> {
    if (isNaN(latitude) || isNaN(longitude)) {
      return createErr('Invalid latitude or longitude');
    }
    if (startDate && !isDate(new Date(startDate))) {
      return createErr('Invalid start date');
    }
    if (endDate && !isDate(new Date(endDate))) {
      return createErr('Invalid end date');
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return createErr('Start date cannot be after end date');
    }

    try {
      const response = await HistoricalWeatherClient.get<{
        hourly: WeatherDTO;
        hourly_units: WeatherUnitsDTO;
      }>(
        `?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&start_date=${startDate}&end_date=${endDate}`
      );
      const weatherData = response.data.hourly;
      const weatherUnits = response.data.hourly_units;

      const weatherReport = WeatherReport.fromWeatherDTO(
        weatherData,
        weatherUnits
      );

      return createOk(weatherReport);
    } catch (error) {
      if (error instanceof AxiosError) {
        return createErr(error.message);
      }

      return createErr(
        'An error occurred while fetching historical weather data'
      );
    }
  }
}
