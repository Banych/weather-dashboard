import { SearchCities } from '@/application/use-cases/SearchCities';
import type { ILocationRepository } from '@/domain/interfaces/ILocationRepository';
import { City } from '@/domain/models/City';
import { createErr, createOk } from 'option-t/plain_result';
import { describe, expect, it, vi } from 'vitest';

describe('SearchCities', () => {
  it('should return locations when the repository finds matches', async () => {
    const mockLocations: City[] = City.fromDTOs([
      {
        country: 'USA',
        name: 'New York',
        latitude: 40.7128,
        longitude: -74.006,
        country_code: 'US',
        country_id: 1,
        id: 1,
        timezone: 'America/New_York',
        elevation: 10,
      },
      {
        country: 'USA',
        name: 'Newark',
        latitude: 40.7357,
        longitude: -74.1724,
        country_code: 'US',
        country_id: 1,
        id: 2,
        timezone: 'America/New_York',
        elevation: 5,
      },
    ]);

    const mockRepository: ILocationRepository = {
      searchLocations: vi.fn().mockResolvedValue(createOk(mockLocations)),
    };

    const searchCities = new SearchCities(mockRepository);
    const result = await searchCities.execute('New');

    expect(mockRepository.searchLocations).toHaveBeenCalledWith('New');
    expect(result.ok).toBe(true);
    expect(result.val).toEqual(mockLocations);
  });

  it('should return an error message when the repository fails', async () => {
    const mockError = 'No locations found';
    const mockRepository: ILocationRepository = {
      searchLocations: vi.fn().mockResolvedValue(createErr(mockError)),
    };

    const searchCities = new SearchCities(mockRepository);
    const result = await searchCities.execute('Unknown');

    expect(mockRepository.searchLocations).toHaveBeenCalledWith('Unknown');
    expect(result.ok).toBe(false);
    expect(result.err).toBe(mockError);
  });
});
