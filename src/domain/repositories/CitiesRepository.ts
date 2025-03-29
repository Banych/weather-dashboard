import LocationClient from '@/domain/clients/LocationClient';
import type { LocationDTO } from '@/domain/dto/LocationDTO';
import type { ILocationRepository } from '@/domain/interfaces/ILocationRepository';
import { City } from '@/domain/models/City';
import { createErr, createOk, type Result } from 'option-t/plain_result';

export class CitiesRepository implements ILocationRepository {
  async searchLocations(query: string): Promise<Result<City[], string>> {
    if (!query) {
      return createErr('Query cannot be empty');
    }

    try {
      const response = await LocationClient.get<LocationDTO[]>(
        `?query=${query}`
      );

      const cities = response.data.map((location) => City.fromDTO(location));

      return createOk(cities);
    } catch (error) {
      if (error instanceof Error) {
        return createErr(error.message);
      }

      return createErr('An error occurred while searching for locations');
    }
  }
}
