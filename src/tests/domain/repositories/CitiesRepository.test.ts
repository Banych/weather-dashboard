import LocationClient from '@/domain/clients/LocationClient';
import { City } from '@/domain/models/City';
import { CitiesRepository } from '@/domain/repositories/CitiesRepository';
import { createErr, createOk } from 'option-t/plain_result';
import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';

vi.mock('@/domain/clients/LocationClient');
vi.mock('@/domain/models/City');

describe('CitiesRepository', () => {
  const citiesRepository = new CitiesRepository();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return an error if query is empty', async () => {
    const result = await citiesRepository.searchLocations('');
    expect(result).toEqual(createErr('Query cannot be empty'));
  });

  it('should return a list of cities if the API call is successful', async () => {
    const mockResponse = {
      data: {
        results: [
          { id: 1, name: 'City1' },
          { id: 2, name: 'City2' },
        ],
      },
    };

    (LocationClient.get as Mock).mockResolvedValue(mockResponse);
    (City.fromDTO as Mock).mockImplementation((dto) => ({
      id: dto.id,
      name: dto.name,
    }));

    const result = await citiesRepository.searchLocations('City');
    expect(LocationClient.get).toHaveBeenCalledWith('?name=City');
    expect(City.fromDTO).toHaveBeenCalledTimes(2);
    expect(result).toEqual(
      createOk([
        { id: 1, name: 'City1' },
        { id: 2, name: 'City2' },
      ])
    );
  });

  it('should return an error if the API call fails', async () => {
    (LocationClient.get as Mock).mockRejectedValue(new Error('Network error'));

    const result = await citiesRepository.searchLocations('City');
    expect(LocationClient.get).toHaveBeenCalledWith('?name=City');
    expect(result).toEqual(createErr('Network error'));
  });

  it('should return a generic error if an unknown error occurs', async () => {
    (LocationClient.get as Mock).mockRejectedValue('Unknown error');

    const result = await citiesRepository.searchLocations('City');
    expect(LocationClient.get).toHaveBeenCalledWith('?name=City');
    expect(result).toEqual(
      createErr('An error occurred while searching for locations')
    );
  });
});
