import HistoricalWeatherClient from '@/domain/clients/HistoricalWeatherClient';
import type { IWeather } from '@/domain/interfaces/IWeather';
import type { IWeatherRepository } from '@/domain/interfaces/IWeatherRepository';
import { AxiosError } from 'axios';
import { isDate } from 'date-fns';
import { createErr, createOk, type Result } from 'option-t/plain_result';

export class HistoricalWeatherRepository implements IWeatherRepository {
  async getWeather(
    latitude: number,
    longitude: number,
    startDate?: string,
    endDate?: string
  ): Promise<Result<IWeather[], string>> {
    if (isNaN(latitude) || isNaN(longitude)) {
      return createErr('Invalid latitude or longitude');
    }
    if (startDate && !isDate(startDate)) {
      return createErr('Invalid start date');
    }
    if (endDate && !isDate(endDate)) {
      return createErr('Invalid end date');
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return createErr('Start date cannot be after end date');
    }

    try {
      const response = await HistoricalWeatherClient.get<{
        hourly: { time: string[]; temperature_2m: number[] };
        hourly_units: { time: string; temperature_2m: string };
      }>(
        `?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&start=${startDate}&end=${endDate}`
      );
      const weatherData = response.data.hourly;
      const weatherUnits = response.data.hourly_units;

      const temperatures = weatherData.time.map((time, index) => ({
        value: weatherData.temperature_2m[index],
        units: weatherUnits.temperature_2m,
        date: new Date(time),
      }));

      return createOk(temperatures);
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
