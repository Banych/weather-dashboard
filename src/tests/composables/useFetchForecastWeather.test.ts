import useFetchForecastWeather from '@composables/useFetchForecastWeather';
import type { ILocation } from '@domain/interfaces/ILocation';
import { WeatherReport } from '@domain/models/WeatherReport';
import { flushPromises } from '@vue/test-utils';
import { createErr, createOk } from 'option-t/plain_result';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

vi.mock('@domain/repositories/ForecastWeatherRepository', () => ({
  ForecastWeatherRepository: vi.fn().mockImplementation(() => ({
    getWeather: vi.fn((latitude: number, longitude: number) => {
      if (latitude === 40.7128 && longitude === -74.006) {
        const weatherReport = WeatherReport.fromWeatherDTO(
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
        return Promise.resolve(createOk(weatherReport));
      } else if (isNaN(latitude) || isNaN(longitude)) {
        return createErr('Invalid latitude or longitude');
      } else if (latitude === 0 && longitude === 0) {
        return createErr('An error occurred');
      }
      return createOk(null);
    }),
  })),
}));

describe('useFetchForecastWeather', () => {
  const location = ref<ILocation | null>(null);

  const { data, isLoading, error } = useFetchForecastWeather(location);

  it('should fetch forecast weather when location is provided', async () => {
    location.value = { latitude: 40.7128, longitude: -74.006 };

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(data.value).toBeInstanceOf(WeatherReport);
    expect(data.value?.temperatures[0].value).toBe(20);
    expect(data.value?.temperatures[0].units).toBe('°C');
    expect(data.value?.relativeHumidity[0].value).toBe(50);
    expect(data.value?.relativeHumidity[0].units).toBe('%');
    expect(data.value?.windSpeed[0].value).toBe(5);
    expect(data.value?.windSpeed[0].units).toBe('m/s');
    expect(error.value).toBeNull();
  });

  it('should not fetch forecast weather when location is null', async () => {
    location.value = null;

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(data.value).toBeNull();
  });

  it('should handle errors from the repository', async () => {
    location.value = { latitude: 0, longitude: 0 };

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(data.value).toBeNull();
    expect(error.value).toBe('An error occurred');
  });

  it('should handle invalid latitude and longitude', async () => {
    location.value = { latitude: NaN, longitude: NaN };

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(data.value).toBeNull();
    expect(error.value).toBe('Invalid latitude or longitude');
  });
});
