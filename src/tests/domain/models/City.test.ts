import type { LocationDTO } from '@domain/dto/LocationDTO';
import type { ILocation } from '@domain/interfaces/ILocation';
import { City } from '@domain/models/City';
import { describe, expect, it } from 'vitest';

describe('City', () => {
  describe('fromDTO', () => {
    it('should create a City instance from a valid LocationDTO', () => {
      const dto: LocationDTO = {
        id: 1,
        name: 'Test City',
        latitude: 40.7128,
        longitude: -74.006,
        country: 'Test Country',
        country_code: 'TC',
        elevation: 10,
        country_id: 1,
        timezone: 'UTC',
      };

      const city = City.fromDTO(dto);

      expect(city).toBeInstanceOf(City);
      expect(city.id).toBe(dto.id);
      expect(city.name).toBe(dto.name);
      expect(city.latitude).toBe(dto.latitude);
      expect(city.longitude).toBe(dto.longitude);
      expect(city.country).toBe(dto.country);
      expect(city.countryCode).toBe(dto.country_code);
      expect(city.elevation).toBe(dto.elevation);
    });

    it('should throw an error for invalid latitude or longitude', () => {
      const dto: LocationDTO = {
        id: 1,
        name: 'Test City',
        latitude: NaN,
        longitude: -74.006,
        country: 'Test Country',
        country_code: 'TC',
        elevation: 10,
        country_id: 1,
        timezone: 'UTC',
      };

      expect(() => City.fromDTO(dto)).toThrow('Invalid latitude or longitude');
    });

    it('should throw an error for invalid elevation', () => {
      const dto: LocationDTO = {
        id: 1,
        name: 'Test City',
        latitude: 40.7128,
        longitude: -74.006,
        country: 'Test Country',
        country_code: 'TC',
        elevation: NaN,
        country_id: 1,
        timezone: 'UTC',
      };

      expect(() => City.fromDTO(dto)).toThrow('Invalid elevation');
    });

    it('should throw an error for missing name', () => {
      const dto: LocationDTO = {
        id: 1,
        name: '',
        latitude: 40.7128,
        longitude: -74.006,
        country: 'Test Country',
        country_code: 'TC',
        elevation: 10,
        country_id: 1,
        timezone: 'UTC',
      };

      expect(() => City.fromDTO(dto)).toThrow('Invalid name');
    });
  });

  describe('fromLocation', () => {
    it('should create a City instance from a valid ILocation', () => {
      const location: ILocation = {
        latitude: 40.7128,
        longitude: -74.006,
        elevation: 10,
      };

      const city = City.fromLocation(location);

      expect(city).toBeInstanceOf(City);
      expect(city.id).toBe(0);
      expect(city.name).toBe('Unknown');
      expect(city.latitude).toBe(location.latitude);
      expect(city.longitude).toBe(location.longitude);
      expect(city.elevation).toBe(location.elevation);
    });

    it('should throw an error for invalid latitude or longitude in ILocation', () => {
      const location: ILocation = {
        latitude: NaN,
        longitude: -74.006,
        elevation: 10,
      };

      expect(() => City.fromLocation(location)).toThrow(
        'Invalid latitude or longitude'
      );
    });

    it('should throw an error for invalid elevation in ILocation', () => {
      const location: ILocation = {
        latitude: 40.7128,
        longitude: -74.006,
        elevation: NaN,
      };

      expect(() => City.fromLocation(location)).toThrow('Invalid elevation');
    });
  });
});
