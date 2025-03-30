import { FetchForecastWeather } from '@application/use-cases/FetchForecastWeather';
import type { IWeatherRepository } from '@domain/interfaces/IWeatherRepository';
import { WeatherReport } from '@domain/models/WeatherReport';
import { createErr, createOk, type Result } from 'option-t/plain_result';
import { describe, expect, it, vi, type Mock } from 'vitest';

describe('FetchForecastWeather', () => {
  const mockWeatherRepository: IWeatherRepository = {
    getWeather: vi.fn(),
  };

  const fetchForecastWeather = new FetchForecastWeather(mockWeatherRepository);

  it('should return weather report when repository call is successful', async () => {
    const latitude = 40.7128;
    const longitude = -74.006;
    const mockWeatherReport = WeatherReport.fromWeatherDTO(
      {
        time: ['2023-10-01'],
        temperature_2m: [20],
        relative_humidity_2m: [50],
        wind_speed_10m: [5],
      },
      {
        temperature_2m: '°C',
        relative_humidity_2m: '%',
        wind_speed_10m: 'm/s',
        time: 'iso8601',
      }
    );
    (mockWeatherRepository.getWeather as Mock).mockResolvedValue(
      createOk(mockWeatherReport)
    );

    const result = await fetchForecastWeather.execute(latitude, longitude);

    expect(mockWeatherRepository.getWeather).toHaveBeenCalledWith(
      latitude,
      longitude
    );
    expect(result.ok).toBe(true);
    expect(result.val).toEqual(mockWeatherReport);
  });

  it('should return an error when repository call fails', async () => {
    const latitude = 40.7128;
    const longitude = -74.006;
    const errorMessage = 'Failed to fetch weather data';
    (mockWeatherRepository.getWeather as Mock).mockResolvedValue(
      createErr(errorMessage)
    );

    const result: Result<WeatherReport, string> =
      await fetchForecastWeather.execute(latitude, longitude);

    expect(mockWeatherRepository.getWeather).toHaveBeenCalledWith(
      latitude,
      longitude
    );
    expect(result.ok).toBe(false);
    expect(result.err).toBe(errorMessage);
  });
});
