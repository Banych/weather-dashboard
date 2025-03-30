import { WindSpeed } from '@domain/models/WindSpeed';
import { describe, expect, it } from 'vitest';

describe('WindSpeed Constructor', () => {
  it('should create a WindSpeed instance with valid inputs', () => {
    const value = 10;
    const units = 'km/h';
    const date = new Date();

    const windSpeed = new WindSpeed(value, units, date);

    expect(windSpeed.value).toBe(value);
    expect(windSpeed.units).toBe(units);
    expect(windSpeed.date).toBe(date);
  });

  it('should throw an error if value is not a number', () => {
    const units = 'km/h';
    const date = new Date();

    expect(() =>
      WindSpeed.fromDTO({
        value: 'invalid' as any,
        units,
        date: date.toISOString(),
      })
    ).toThrowError();
  });

  it('should throw an error if units is not a string', () => {
    const value = 10;
    const date = new Date();

    expect(() =>
      WindSpeed.fromDTO({
        value,
        units: 123 as any,
        date: date.toISOString(),
      })
    ).toThrowError();
  });

  it('should throw an error if date is not a valid Date object', () => {
    const value = 10;
    const units = 'km/h';

    expect(() =>
      WindSpeed.fromDTO({
        value,
        units,
        date: 'invalid-date' as any,
      })
    ).toThrowError();
  });
});
