import type { ILocation } from '@/domain/interfaces/ILocation';
import type { ILocationRepository } from '@/domain/interfaces/ILocationRepository';
import type { Result } from 'option-t/plain_result';

export class SearchCities {
  constructor(private readonly weatherRepository: ILocationRepository) {}

  async execute(query: string): Promise<Result<ILocation[], string>> {
    return this.weatherRepository.searchLocations(query);
  }
}
