import useCitySearch from '@/composables/useCitySearch';
import { flushPromises } from '@vue/test-utils';
import { createErr, createOk } from 'option-t/plain_result';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

vi.mock('@/domain/repositories/CitiesRepository', () => ({
  CitiesRepository: vi.fn().mockImplementation(() => ({
    searchLocations: vi.fn((query: string) => {
      if (query === 'New') {
        return createOk([
          {
            id: 1,
            name: 'New York',
            latitude: 40.7128,
            longitude: -74.006,
          },
        ]);
      } else if (query === 'Error') {
        return createErr('An error occurred');
      }
      return createOk([]);
    }),
  })),
}));

describe('useCitySearch', () => {
  const query = ref('');
  const { results, isLoading, error } = useCitySearch(query);

  it('should fetch cities when query length is >= 3', async () => {
    query.value = 'New';

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(results.value).toHaveLength(1);
    expect(results.value[0].name).toBe('New York');
    expect(error.value).toBeNull();
  });

  it('should not fetch cities when query length is < 3', async () => {
    query.value = 'Ne';

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(results.value).toHaveLength(0);
    expect(error.value).toBeNull();
  });

  it('should handle errors from the repository', async () => {
    query.value = 'Error';

    await flushPromises();

    expect(isLoading.value).toBe(false);
    expect(results.value).toHaveLength(0);
    expect(error.value).toBe('An error occurred');
  });

  it('should reset results when query length is < 3', async () => {
    query.value = 'New';
    await flushPromises();

    query.value = 'Ne';
    await flushPromises();

    expect(results.value).toHaveLength(0);
  });
});
