import type { ILocation } from '@/domain/interfaces/ILocation';
import type { Result } from 'option-t/plain_result';

export interface ILocationRepository {
  searchLocations(query: string): Promise<Result<ILocation[], string>>;
}
