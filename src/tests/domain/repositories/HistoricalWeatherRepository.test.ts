import { describe, it, expect, vi } from 'vitest';
import { HistoricalWeatherRepository } from '@/domain/repositories/HistoricalWeatherRepository';
import HistoricalWeatherClient from '@/domain/clients/HistoricalWeatherClient';
import { createErr, createOk } from 'option-t/plain_result';
import { WeatherReport } from '@/domain/models/WeatherReport';
import { AxiosError } from 'axios';
import type { WeatherDTO, WeatherUnitsDTO } from '@/domain/dto/WeatherDTO';

vi.mock('@/domain/clients/HistoricalWeatherClient');

describe('HistoricalWeatherRepository', () => {
  const repository = new HistoricalWeatherRepository();

  it('should return an error if latitude or longitude is invalid', async () => {
    const result = await repository.getWeather(NaN, 100);
    expect(result).toEqual(createErr('Invalid latitude or longitude'));
  });

  it('should return an error if startDate is invalid', async () => {
    const result = await repository.getWeather(10, 20, 'invalid-date');
    expect(result).toEqual(createErr('Invalid start date'));
  });

  it('should return an error if endDate is invalid', async () => {
    const result = await repository.getWeather(
      10,
      20,
      '2023-01-01',
      'invalid-date'
    );
    expect(result).toEqual(createErr('Invalid end date'));
  });

  it('should return an error if startDate is after endDate', async () => {
    const result = await repository.getWeather(
      10,
      20,
      '2023-01-02',
      '2023-01-01'
    );
    expect(result).toEqual(createErr('Start date cannot be after end date'));
  });

  it('should return weather data on successful API call', async () => {
    const mockResponse: {
      data: {
        hourly: WeatherDTO;
        hourly_units: WeatherUnitsDTO;
      };
    } = {
      data: {
        hourly: {
          temperature_2m: [15, 16, 17],
          time: ['2023-01-01T00:00', '2023-01-01T01:00', '2023-01-01T02:00'],
        },
        hourly_units: {
          temperature_2m: '°C',
          time: 'ISO8601',
          wind_speed_10m: 'm/s',
          relative_humidity_2m: '%',
        },
      },
    };
    vi.mocked(HistoricalWeatherClient.get).mockResolvedValue(mockResponse);

    const result = await repository.getWeather(
      10,
      20,
      '2023-01-01',
      '2023-01-02'
    );
    expect(result).toEqual(
      createOk(
        WeatherReport.fromWeatherDTO(
          mockResponse.data.hourly,
          mockResponse.data.hourly_units
        )
      )
    );
  });

  it('should return an error if API call fails with AxiosError', async () => {
    const axiosError = new AxiosError('Network Error');
    vi.mocked(HistoricalWeatherClient.get).mockRejectedValue(axiosError);

    const result = await repository.getWeather(
      10,
      20,
      '2023-01-01',
      '2023-01-02'
    );
    expect(result).toEqual(createErr('Network Error'));
  });

  it('should return a generic error if API call fails with a non-AxiosError', async () => {
    vi.mocked(HistoricalWeatherClient.get).mockRejectedValue(
      new Error('Unexpected Error')
    );

    const result = await repository.getWeather(
      10,
      20,
      '2023-01-01',
      '2023-01-02'
    );
    expect(result).toEqual(
      createErr('An error occurred while fetching historical weather data')
    );
  });
});
