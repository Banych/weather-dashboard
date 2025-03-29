import { describe, it, expect } from 'vitest';
import { RelativeHumidity } from '@/domain/models/RelativeHumidity';
import type {
  SmallWeatherDTO,
  WeatherDTO,
  WeatherUnitsDTO,
} from '@/domain/dto/WeatherDTO';
import type { IWeather } from '@/domain/interfaces/IWeather';

describe('RelativeHumidity', () => {
  describe('fromDTO', () => {
    it('should create a RelativeHumidity instance from a valid DTO', () => {
      const dto = {
        value: 75,
        units: '%',
        date: '2023-01-01T00:00:00.000Z',
      };

      const result = RelativeHumidity.fromDTO(dto);

      expect(result).toBeInstanceOf(RelativeHumidity);
      expect(result.value).toBe(dto.value);
      expect(result.units).toBe(dto.units);
      expect(result.date.toISOString()).toBe(dto.date);
    });

    it('should throw an error for an invalid DTO', () => {
      const invalidDTO = {
        value: null,
        units: '%',
        date: 'invalid-date',
      };

      expect(() =>
        RelativeHumidity.fromDTO(invalidDTO as unknown as SmallWeatherDTO)
      ).toThrowError('Invalid RelativeHumidityDTO');
    });
  });

  describe('fromWeather', () => {
    it('should create a RelativeHumidity instance from a valid IWeather object', () => {
      const weather: IWeather = {
        value: 80,
        units: '%',
        date: new Date('2023-01-01T00:00:00Z'),
      };

      const result = RelativeHumidity.fromWeather(weather);

      expect(result).toBeInstanceOf(RelativeHumidity);
      expect(result.value).toBe(weather.value);
      expect(result.units).toBe(weather.units);
      expect(result.date).toEqual(weather.date);
    });

    it('should throw an error for an invalid IWeather object', () => {
      const invalidWeather = {
        value: undefined,
        units: '%',
        date: new Date(),
      } as unknown as IWeather;

      expect(() => RelativeHumidity.fromWeather(invalidWeather)).toThrowError(
        'Invalid RelativeHumidityDTO'
      );
    });
  });

  describe('fromWeatherDTO', () => {
    it('should create an array of RelativeHumidity instances from valid WeatherDTO and WeatherUnitsDTO', () => {
      const weatherDTO: WeatherDTO = {
        relative_humidity_2m: [70, 75, 80],
        time: [
          '2023-01-01T00:00:00.000Z',
          '2023-01-01T01:00:00.000Z',
          '2023-01-01T02:00:00.000Z',
        ],
      };
      const weatherUnitsDTO: Partial<WeatherUnitsDTO> = {
        time: 'ISO8601',
        relative_humidity_2m: '%',
      };

      const result = RelativeHumidity.fromWeatherDTO(
        weatherDTO,
        weatherUnitsDTO as WeatherUnitsDTO
      );

      expect(result).toHaveLength(3);
      result.forEach((humidity, index) => {
        expect(humidity).toBeInstanceOf(RelativeHumidity);
        expect(humidity.value).toBe(weatherDTO.relative_humidity_2m![index]);
        expect(humidity.units).toBe(weatherUnitsDTO.relative_humidity_2m);
        expect(humidity.date.toISOString()).toBe(weatherDTO.time[index]);
      });
    });

    it('should throw an error for invalid WeatherDTO or WeatherUnitsDTO', () => {
      const invalidWeatherDTO = {
        relative_humidity_2m: null,
        time: ['2023-01-01T00:00:00Z'],
      } as unknown as WeatherDTO;
      const invalidWeatherUnitsDTO = {
        relative_humidity_2m: null,
      } as unknown as WeatherUnitsDTO;

      expect(() =>
        RelativeHumidity.fromWeatherDTO(
          invalidWeatherDTO,
          invalidWeatherUnitsDTO
        )
      ).toThrowError('Invalid WeatherDTO');
    });
  });
});
