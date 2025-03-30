import { Temperature } from '@domain/models/Temperature';
import { describe, expect, it } from 'vitest';

describe('Temperature', () => {
  it('should create a Temperature instance from a valid DTO', () => {
    const dto = { value: 25, units: '°C', date: '2023-10-01T12:00:00Z' };
    const temperature = Temperature.fromDTO(dto);

    expect(temperature.value).toBe(25);
    expect(temperature.units).toBe('°C');
    expect(temperature.date.toISOString()).toBe('2023-10-01T12:00:00.000Z');
  });

  it('should throw an error for an invalid DTO', () => {
    const invalidDto = { value: 0, units: '', date: '' };

    expect(() => Temperature.fromDTO(invalidDto)).toThrowError(
      'Invalid TemperatureDTO'
    );
  });

  it('should throw an error for an invalid date', () => {
    const invalidDto = { value: 25, units: '°C', date: 'invalid-date' };

    expect(() => Temperature.fromDTO(invalidDto)).toThrowError('Invalid date');
  });

  it('should throw an error for an invalid value', () => {
    const invalidDto = {
      value: NaN,
      units: '°C',
      date: '2023-10-01T12:00:00Z',
    };

    expect(() => Temperature.fromDTO(invalidDto)).toThrowError('Invalid value');
  });

  it('should throw an error for an invalid units', () => {
    const invalidDto = {
      value: 25,
      units: 'invalid',
      date: '2023-10-01T12:00:00Z',
    };

    expect(() => Temperature.fromDTO(invalidDto)).toThrowError('Invalid units');
  });
});
