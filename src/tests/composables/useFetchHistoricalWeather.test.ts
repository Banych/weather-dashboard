import useFetchHistoricalWeather from '@composables/useFetchHistoricalWeather';
import type { ILocation } from '@domain/interfaces/ILocation';
import { WeatherReport } from '@domain/models/WeatherReport';
import { flushPromises } from '@vue/test-utils';
import { createErr, createOk } from 'option-t/plain_result';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

vi.mock('@domain/repositories/HistoricalWeatherRepository', () => ({
  HistoricalWeatherRepository: vi.fn().mockImplementation(() => ({
    getWeather: vi.fn(
      (
        latitude: number,
        longitude: number,
        startDate: string,
        endDate: string
      ) => {
        if (isNaN(latitude) || isNaN(longitude)) {
          return createErr('Invalid latitude or longitude');
        }
        if (latitude === 0 && longitude === 0) {
          return createErr('An error occurred');
        }
        if (
          latitude === 40.7128 &&
          longitude === -74.006 &&
          startDate === '2023-10-01' &&
          endDate === '2023-10-02'
        ) {
          const weatherReport = WeatherReport.fromWeatherDTO(
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
          return Promise.resolve(createOk(weatherReport));
        }
        return createOk(null);
      }
    ),
  })),
}));

describe('useFetchForecastWeather', () => {
  const location = ref<ILocation | null>(null);
  const startDate = ref<string | null>(null);
  const endDate = ref<string | null>(null);

  const { data, isLoading, error } = useFetchHistoricalWeather(
    location,
    startDate,
    endDate
  );

  it('should fetch forecast weather when location and dates are provided', async () => {
    location.value = { latitude: 40.7128, longitude: -74.006 };
    startDate.value = '2023-10-01';
    endDate.value = '2023-10-02';

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(data.value).toBeInstanceOf(WeatherReport);
    expect(data.value?.temperatures[0].value).toBe(20);
    expect(data.value?.temperatures[0].units).toBe('°C');
    expect(data.value?.relativeHumidity[0].value).toBe(50);
    expect(data.value?.relativeHumidity[0].units).toBe('%');
    expect(data.value?.windSpeed[0].value).toBe(5);
    expect(data.value?.windSpeed[0].units).toBe('m/s');

    expect(data.value?.temperatures[1].value).toBe(22);
    expect(data.value?.temperatures[1].units).toBe('°C');
    expect(data.value?.relativeHumidity[1].value).toBe(55);
    expect(data.value?.relativeHumidity[1].units).toBe('%');
    expect(data.value?.windSpeed[1].value).toBe(6);
    expect(data.value?.windSpeed[1].units).toBe('m/s');

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

  it('should not fetch forecast weather when startDate or endDate is null', async () => {
    location.value = { latitude: 40.7128, longitude: -74.006 };
    startDate.value = null;
    endDate.value = null;

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(data.value).toBeNull();
  });

  it('should not fetch forecast weather when startDate or endDate is empty', async () => {
    location.value = { latitude: 40.7128, longitude: -74.006 };
    startDate.value = '';
    endDate.value = '';

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(data.value).toBeNull();
  });

  it('should not fetch forecast weather when startDate or endDate is invalid', async () => {
    location.value = { latitude: 40.7128, longitude: -74.006 };
    startDate.value = 'invalid-date';
    endDate.value = 'invalid-date';

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(data.value).toBeNull();
  });

  it('should not fetch forecast weather when location is null and startDate or endDate is provided', async () => {
    location.value = null;
    startDate.value = '2023-10-01';
    endDate.value = '2023-10-02';

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(data.value).toBeNull();
  });

  it('should not fetch forecast weather when location is provided and startDate or endDate is null', async () => {
    location.value = { latitude: 40.7128, longitude: -74.006 };
    startDate.value = null;
    endDate.value = '2023-10-02';

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(data.value).toBeNull();
  });
});
