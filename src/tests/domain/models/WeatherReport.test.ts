import { describe, it, expect } from 'vitest';
import { WeatherReport } from '@/domain/models/WeatherReport';
import type { WeatherDTO, WeatherUnitsDTO } from '@/domain/dto/WeatherDTO';
import { Temperature } from '@/domain/models/Temperature';
import { RelativeHumidity } from '@/domain/models/RelativeHumidity';
import { WindSpeed } from '@/domain/models/WindSpeed';

describe('WeatherReport', () => {
  const mockWeatherDTO: WeatherDTO = {
    time: ['2023-01-01T00:00:00Z', '2023-01-02T00:00:00Z'],
    temperature_2m: [10, 15],
    relative_humidity_2m: [50, 60],
    wind_speed_10m: [5, 10],
  };

  const mockUnits: WeatherUnitsDTO = {
    temperature_2m: '°C',
    relative_humidity_2m: '%',
    wind_speed_10m: 'km/h',
    time: 'ISO8601',
  };

  it('should create a WeatherReport instance from WeatherDTO', () => {
    const weatherReport = WeatherReport.fromWeatherDTO(
      mockWeatherDTO,
      mockUnits
    );
    expect(weatherReport).toBeInstanceOf(WeatherReport);
  });

  it('should throw an error if WeatherDTO is invalid', () => {
    expect(() => WeatherReport.fromWeatherDTO(null as any, mockUnits)).toThrow(
      'Invalid WeatherDTO'
    );
    expect(() => WeatherReport.fromWeatherDTO({} as any, mockUnits)).toThrow(
      'Invalid WeatherDTO: time is required'
    );
    expect(() =>
      WeatherReport.fromWeatherDTO({ time: [] } as any, mockUnits)
    ).toThrow('Invalid WeatherDTO: time is required');
    expect(() =>
      WeatherReport.fromWeatherDTO(
        { time: ['2023-01-01T00:00:00Z'] } as any,
        mockUnits
      )
    ).toThrow(
      'Invalid WeatherDTO: at least one of temperature_2m, relative_humidity_2m, wind_speed_10m is required'
    );
  });

  it('should throw an error if WeatherUnitsDTO is invalid', () => {
    expect(() =>
      WeatherReport.fromWeatherDTO(mockWeatherDTO, null as any)
    ).toThrow('Invalid WeatherUnitsDTO');
  });

  it('should return temperatures when accessed', () => {
    const weatherReport = WeatherReport.fromWeatherDTO(
      mockWeatherDTO,
      mockUnits
    );
    const temperatures = weatherReport.temperatures;
    expect(temperatures).toHaveLength(2);
    expect(temperatures[0]).toBeInstanceOf(Temperature);
  });

  it('should return relative humidity when accessed', () => {
    const weatherReport = WeatherReport.fromWeatherDTO(
      mockWeatherDTO,
      mockUnits
    );
    const relativeHumidity = weatherReport.relativeHumidity;
    expect(relativeHumidity).toHaveLength(2);
    expect(relativeHumidity[0]).toBeInstanceOf(RelativeHumidity);
  });

  it('should return wind speed when accessed', () => {
    const weatherReport = WeatherReport.fromWeatherDTO(
      mockWeatherDTO,
      mockUnits
    );
    const windSpeed = weatherReport.windSpeed;
    expect(windSpeed).toHaveLength(2);
    expect(windSpeed[0]).toBeInstanceOf(WindSpeed);
  });

  it('should return characteristics containing all available data', () => {
    const weatherReport = WeatherReport.fromWeatherDTO(
      mockWeatherDTO,
      mockUnits
    );
    const characteristics = weatherReport.characteristics;
    expect(characteristics).toHaveLength(3);
    expect(characteristics[0][0]).toBeInstanceOf(Temperature);
    expect(characteristics[1][0]).toBeInstanceOf(RelativeHumidity);
    expect(characteristics[2][0]).toBeInstanceOf(WindSpeed);
  });

  it('should return days as Date objects', () => {
    const weatherReport = WeatherReport.fromWeatherDTO(
      mockWeatherDTO,
      mockUnits
    );
    const days = weatherReport.days;
    expect(days).toHaveLength(2);
    expect(days[0]).toBeInstanceOf(Date);
    expect(days[0].toISOString()).toBe('2023-01-01T00:00:00.000Z');
  });
});
