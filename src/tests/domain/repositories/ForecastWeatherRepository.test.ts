import { describe, it, expect, vi, type Mock } from 'vitest';
import { ForecastWeatherRepository } from '@/domain/repositories/ForecastWeatherRepository';
import ForecastWeatherClient from '@/domain/clients/ForecastWeatherClient';
import { WeatherReport } from '@/domain/models/WeatherReport';
import { createOk, createErr } from 'option-t/plain_result';
import { AxiosError } from 'axios';
import type { WeatherDTO, WeatherUnitsDTO } from '@/domain/dto/WeatherDTO';

vi.mock('@/domain/clients/ForecastWeatherClient');

describe('ForecastWeatherRepository', () => {
  const repository = new ForecastWeatherRepository();

  it('should return an error if latitude or longitude is invalid', async () => {
    const result = await repository.getWeather(NaN, 50);
    expect(result).toEqual(createErr('Invalid latitude or longitude'));
  });

  it('should return weather data when API call is successful', async () => {
    const mockWeatherData: WeatherDTO = {
      time: ['2023-10-01T00:00'],
      temperature_2m: [20],
      relative_humidity_2m: [50],
      wind_speed_10m: [5],
    };
    const mockWeatherUnits: WeatherUnitsDTO = {
      time: 'ISO8601',
      temperature_2m: '°C',
      relative_humidity_2m: '%',
      wind_speed_10m: 'm/s',
    };

    (ForecastWeatherClient.get as Mock).mockResolvedValue({
      data: {
        hourly: mockWeatherData,
        hourly_units: mockWeatherUnits,
      },
    });

    vi.spyOn(WeatherReport, 'fromWeatherDTO').mockReturnValue(
      new WeatherReport(mockWeatherData, mockWeatherUnits)
    );

    const result = await repository.getWeather(40, 50);
    expect(result).toEqual(createOk(expect.any(WeatherReport)));
    expect(ForecastWeatherClient.get).toHaveBeenCalledWith(
      '?latitude=40&longitude=50&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m'
    );
  });

  it('should return an error if API call fails with AxiosError', async () => {
    const mockError = new AxiosError('Network Error');
    (ForecastWeatherClient.get as Mock).mockRejectedValue(mockError);

    const result = await repository.getWeather(40, 50);
    expect(result).toEqual(createErr('Network Error'));
  });

  it('should return a generic error if an unknown error occurs', async () => {
    (ForecastWeatherClient.get as Mock).mockRejectedValue(
      new Error('Unknown Error')
    );

    const result = await repository.getWeather(40, 50);
    expect(result).toEqual(
      createErr('An error occurred while fetching weather data')
    );
  });
});
