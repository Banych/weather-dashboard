<script setup lang="ts">
import CityInput from '@components/CityInput.vue';
import CoordinatesInput from '@components/CoordinatesInput.vue';
import HistoricalDataInput from '@components/HistoricalDataInput.vue';
import WeatherChart from '@components/WeatherChart.vue';
import WeatherTable from '@components/WeatherTable.vue';
import useFetchForecastWeather from '@composables/useFetchForecastWeather';
import useFetchHistoricalWeather from '@composables/useFetchHistoricalWeather';
import { type ILocation } from '@domain/interfaces/ILocation';
import type { City } from '@domain/models/City';
import type { WeatherReport } from '@domain/models/WeatherReport';
import { computed, ref } from 'vue';

const selectedCity = ref<City | null>(null);
const location = ref<ILocation | null>(null);
const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);

const currentLocation = computed((): ILocation | null => {
  if (selectedCity.value) {
    return selectedCity.value;
  }
  if (location.value) {
    return location.value;
  }
  return null;
});

const {
  data: forecastWeatherData,
  error: forecastWeatherDataError,
  isLoading: forecastWeatherDataIsLoading,
} = useFetchForecastWeather(currentLocation);

const {
  data: historicalWeatherData,
  error: historicalWeatherDataError,
  isLoading: historicalWeatherDataIsLoading,
} = useFetchHistoricalWeather(currentLocation, startDate, endDate);

const isLoading = computed(() => {
  return (
    forecastWeatherDataIsLoading.value || historicalWeatherDataIsLoading.value
  );
});

const allErrors = computed(() => {
  const errors: string[] = [];
  if (forecastWeatherDataError.value) {
    errors.push(forecastWeatherDataError.value);
  }
  if (historicalWeatherDataError.value) {
    errors.push(historicalWeatherDataError.value);
  }
  return errors.length > 0 ? errors : null;
});

const handleUpdateLocation = (newLocation: ILocation) => {
  location.value = newLocation;
  selectedCity.value = null;
};

const handleSelectCity = (city: City) => {
  selectedCity.value = city;
  location.value = city;
};
</script>

<template>
  <div class="container m-auto">
    <h1 class="text-2xl leading-10 font-semibold">Weather Dashboard</h1>
    <div class="flex gap-2 flex-wrap">
      <CityInput @select="handleSelectCity" />
      <CoordinatesInput
        :currentLocation="currentLocation"
        @update:location="handleUpdateLocation"
      />
      <HistoricalDataInput
        v-model:end-date="endDate"
        v-model:start-date="startDate"
        class="w-full"
      />
    </div>
    <div v-if="isLoading" class="text-center">
      <p>Loading weather data...</p>
    </div>
    <div v-if="allErrors" class="text-red-500 text-center">
      <p>Error loading weather data:</p>
      <ul>
        <li v-for="(error, index) in allErrors" :key="index">
          {{ error }}
        </li>
      </ul>
    </div>
    <template v-if="!isLoading && !allErrors">
      <WeatherTable
        v-if="!!forecastWeatherData"
        :report="forecastWeatherData as WeatherReport"
      >
        <template #title>
          <span>Forecast Weather</span>
        </template>
      </WeatherTable>
      <WeatherChart
        v-if="!!forecastWeatherData"
        title="Forecast Weather"
        :report="forecastWeatherData as WeatherReport"
      />
      <WeatherTable
        v-if="!!historicalWeatherData"
        :report="historicalWeatherData as WeatherReport"
      >
        <template #title>
          <span>Historical Weather</span>
        </template>
      </WeatherTable>
      <WeatherChart
        v-if="!!historicalWeatherData"
        title="Historical Weather"
        :report="historicalWeatherData as WeatherReport"
      />
    </template>
  </div>
</template>
