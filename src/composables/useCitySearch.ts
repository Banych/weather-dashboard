import { SearchCities } from '@/application/use-cases/SearchCities';
import { City } from '@/domain/models/City';
import { CitiesRepository } from '@/domain/repositories/CitiesRepository';
import type { Result } from 'option-t/plain_result';
import { ref, watch, type Ref } from 'vue';

export default (query: Ref<string>) => {
  const results = ref<City[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const citiesRepository = new CitiesRepository();
  const searchCities = new SearchCities(citiesRepository);

  const search = async (query: string) => {
    isLoading.value = true;
    error.value = null;
    results.value = [];

    try {
      const response = (await searchCities.execute(query)) as Result<
        City[],
        string
      >;

      if (response.ok) {
        results.value = response.val;
      } else {
        error.value = response.err;
      }
    } catch (err) {
      error.value = 'An unexpected error occurred';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  watch(query, (newQuery) => {
    if (newQuery.length >= 3) {
      search(newQuery);
    } else {
      results.value = [];
    }
  });

  return {
    results,
    isLoading,
    error,
  };
};
