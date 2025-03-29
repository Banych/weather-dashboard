import { FetchHistoricalWeather } from '@/application/use-cases/FetchHistoricalWeather';
import type { ILocation } from '@/domain/interfaces/ILocation';
import type { WeatherReport } from '@/domain/models/WeatherReport';
import { HistoricalWeatherRepository } from '@/domain/repositories/HistoricalWeatherRepository';
import { ref, watch, type Ref } from 'vue';

export default (
  location: Ref<ILocation | null>,
  startDate: Ref<string | null>,
  endDate: Ref<string | null>
) => {
  const data = ref<WeatherReport | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const weatherRepository = new HistoricalWeatherRepository();
  const fetchHistoricalWeather = new FetchHistoricalWeather(weatherRepository);

  const fetch = async (
    location: ILocation,
    startDate: string,
    endDate: string
  ) => {
    isLoading.value = true;
    error.value = null;
    data.value = null;

    try {
      const response = await fetchHistoricalWeather.execute(
        location.latitude,
        location.longitude,
        startDate,
        endDate
      );

      if (response.ok) {
        data.value = response.val;
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

  watch(
    [location, startDate, endDate],
    ([newLocation, newStartDate, newEndDate]) => {
      if (newLocation && newStartDate && newEndDate) {
        fetch(newLocation, newStartDate, newEndDate);
      } else {
        data.value = null;
      }
    }
  );

  return {
    data,
    isLoading,
    error,
  };
};
