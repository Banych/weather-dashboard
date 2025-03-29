import { FetchHistoricalWeather } from '@/application/use-cases/FetchHistoricalWeather';
import type { IWeatherRepository } from '@/domain/interfaces/IWeatherRepository';
import { WeatherReport } from '@/domain/models/WeatherReport';
import { createErr, createOk } from 'option-t/plain_result';
import { describe, expect, it, vi, type Mock } from 'vitest';

describe('FetchHistoricalWeather', () => {
  const mockWeatherRepository: IWeatherRepository = {
    getWeather: vi.fn(),
  };

  const fetchHistoricalWeather = new FetchHistoricalWeather(
    mockWeatherRepository
  );

  const latitude = 40.7128;
  const longitude = -74.006;
  const startDate = '2023-01-01';
  const endDate = '2023-01-02';

  it('should return weather data when the repository call is successful', async () => {
    const mockWeatherReport = WeatherReport.fromWeatherDTO(
      {
        time: ['2023-10-01', '2023-10-02'],
        temperature_2m: [20, 22],
        relative_humidity_2m: [50, 55],
        wind_speed_10m: [5, 6],
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

    const result = await fetchHistoricalWeather.execute(
      latitude,
      longitude,
      startDate,
      endDate
    );

    expect(mockWeatherRepository.getWeather).toHaveBeenCalledWith(
      latitude,
      longitude,
      startDate,
      endDate
    );
    expect(result.ok).toBe(true);
    expect(result.val).toEqual(mockWeatherReport);
  });

  it('should return an error when the repository call fails', async () => {
    const mockError = createErr('Failed to fetch weather data');
    (mockWeatherRepository.getWeather as Mock).mockResolvedValue(mockError);

    const result = await fetchHistoricalWeather.execute(
      latitude,
      longitude,
      startDate,
      endDate
    );

    expect(mockWeatherRepository.getWeather).toHaveBeenCalledWith(
      latitude,
      longitude,
      startDate,
      endDate
    );
    expect(result.ok).toBe(false);
    expect(result.err).toBe(mockError.err);
  });
});
