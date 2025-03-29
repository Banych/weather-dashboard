import type { LocationDTO } from '@/domain/dto/LocationDTO';
import type { ILocation } from '@/domain/interfaces/ILocation';

export class City implements ILocation {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly country?: string,
    public readonly countryCode?: string,
    public readonly elevation?: number
  ) {}

  private static validateDTO(dto: LocationDTO): void {
    if (!dto.latitude || !dto.longitude) {
      throw new Error('Invalid LocationDTO');
    }
    if (isNaN(dto.latitude) || isNaN(dto.longitude)) {
      throw new Error('Invalid latitude or longitude');
    }
    if (dto.elevation && isNaN(dto.elevation)) {
      throw new Error('Invalid elevation');
    }
    if (typeof dto.latitude !== 'number' || typeof dto.longitude !== 'number') {
      throw new Error('Invalid latitude or longitude');
    }
    if (dto.elevation && typeof dto.elevation !== 'number') {
      throw new Error('Invalid elevation');
    }
    if (!dto.name) {
      throw new Error('Invalid name');
    }
  }

  static fromDTO(dto: LocationDTO): City {
    this.validateDTO(dto);

    return new City(
      dto.id,
      dto.name,
      dto.latitude,
      dto.longitude,
      dto.country,
      dto.country_code,
      dto.elevation
    );
  }

  static fromLocation(location: ILocation): City {
    this.validateDTO({
      id: 0,
      latitude: location.latitude,
      longitude: location.longitude,
      elevation: location.elevation,
      name: 'Unknown',
      country_code: 'Unknown',
      country: 'Unknown',
      country_id: 0,
      timezone: 'Unknown',
    });

    return new City(
      0,
      'Unknown',
      location.latitude,
      location.longitude,
      undefined,
      undefined,
      location.elevation
    );
  }
}
