import ForecastWeatherClient from '@domain/clients/ForecastWeatherClient';
import type { WeatherDTO, WeatherUnitsDTO } from '@domain/dto/WeatherDTO';
import type { IWeatherRepository } from '@domain/interfaces/IWeatherRepository';
import { WeatherReport } from '@domain/models/WeatherReport';
import { AxiosError } from 'axios';
import { type Result, createErr, createOk } from 'option-t/plain_result';

export class ForecastWeatherRepository implements IWeatherRepository {
  async getWeather(
    latitude: number,
    longitude: number
  ): Promise<Result<WeatherReport, string>> {
    if (isNaN(latitude) || isNaN(longitude)) {
      return Promise.resolve(createErr('Invalid latitude or longitude'));
    }

    try {
      const response = await ForecastWeatherClient.get<{
        hourly: WeatherDTO;
        hourly_units: WeatherUnitsDTO;
      }>(
        `?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
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

      return createErr('An error occurred while fetching weather data');
    }
  }
}
