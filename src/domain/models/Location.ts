import type { LocationDTO } from '@domain/dto/LocationDTO';
import type { ILocation } from '@domain/interfaces/ILocation';

export class Location implements ILocation {
  constructor(
    public latitude: number,
    public longitude: number,
    public elevation?: number
  ) {}

  static fromDTO(dto: LocationDTO): Location {
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

    return new Location(dto.latitude, dto.longitude, dto.elevation);
  }
}
