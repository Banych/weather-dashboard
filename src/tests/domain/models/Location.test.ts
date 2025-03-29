import { describe, it, expect } from 'vitest';
import { Location } from '@/domain/models/Location';
import type { LocationDTO } from '@/domain/dto/LocationDTO';

describe('Location', () => {
  describe('fromDTO', () => {
    it('should create a Location instance from a valid LocationDTO', () => {
      const dto: LocationDTO = {
        latitude: 40.7128,
        longitude: -74.006,
        elevation: 10,
        country: 'USA',
        country_code: 'US',
        country_id: 1,
        id: 1,
        name: 'New York',
        timezone: 'America/New_York',
      };
      const location = Location.fromDTO(dto);

      expect(location).toBeInstanceOf(Location);
      expect(location.latitude).toBe(dto.latitude);
      expect(location.longitude).toBe(dto.longitude);
      expect(location.elevation).toBe(dto.elevation);
    });

    it('should throw an error if latitude or longitude is missing', () => {
      const dto: Partial<LocationDTO> = { latitude: 40.7128 };

      expect(() => Location.fromDTO(dto as LocationDTO)).toThrowError(
        'Invalid LocationDTO'
      );
    });

    it('should throw an error if latitude or longitude is not a number', () => {
      const dto: LocationDTO = {
        latitude: 'invalid' as unknown as number,
        longitude: -74.006,
        elevation: 10,
        country: 'USA',
        country_code: 'US',
        country_id: 1,
        id: 1,
        name: 'New York',
        timezone: 'America/New_York',
      };

      expect(() => Location.fromDTO(dto)).toThrowError(
        'Invalid latitude or longitude'
      );
    });

    it('should throw an error if elevation is not a number', () => {
      const dto: LocationDTO = {
        latitude: 40.7128,
        longitude: -74.006,
        elevation: 'invalid' as unknown as number,
        country: 'USA',
        country_code: 'US',
        country_id: 1,
        id: 1,
        name: 'New York',
        timezone: 'America/New_York',
      };

      expect(() => Location.fromDTO(dto)).toThrowError('Invalid elevation');
    });

    it('should create a Location instance if elevation is undefined', () => {
      const dto: LocationDTO = {
        latitude: 40.7128,
        longitude: -74.006,
        country: 'USA',
        country_code: 'US',
        country_id: 1,
        id: 1,
        name: 'New York',
        timezone: 'America/New_York',
      };
      const location = Location.fromDTO(dto);

      expect(location).toBeInstanceOf(Location);
      expect(location.latitude).toBe(dto.latitude);
      expect(location.longitude).toBe(dto.longitude);
      expect(location.elevation).toBeUndefined();
    });
  });
});
