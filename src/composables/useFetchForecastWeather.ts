import { FetchForecastWeather } from '@/application/use-cases/FetchForecastWeather';
import type { ILocation } from '@/domain/interfaces/ILocation';
import { WeatherReport } from '@/domain/models/WeatherReport';
import { ForecastWeatherRepository } from '@/domain/repositories/ForecastWeatherRepository';
import { ref, watch, type Ref } from 'vue';

export default (location: Ref<ILocation | null>) => {
  const data = ref<WeatherReport | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const weatherRepository = new ForecastWeatherRepository();
  const fetchForecastWeather = new FetchForecastWeather(weatherRepository);

  const fetch = async (location: ILocation) => {
    isLoading.value = true;
    error.value = null;
    data.value = null;

    try {
      const response = await fetchForecastWeather.execute(
        location.latitude,
        location.longitude
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

  watch(location, (newLocation) => {
    if (newLocation) {
      fetch(newLocation);
    } else {
      data.value = null;
    }
  });

  return {
    data,
    isLoading,
    error,
  };
};
