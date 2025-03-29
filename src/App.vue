<script setup lang="ts">
import CityInput from '@components/CityInput.vue';
import CoordinatesInput from '@components/CoordinatesInput.vue';
import WeatherTable from '@components/WeatherTable.vue';
import useFetchWeather from '@composables/useFetchWeather';
import { type ILocation } from '@domain/interfaces/ILocation';
import type { City } from '@domain/models/City';
import type { WeatherReport } from '@domain/models/WeatherReport';
import { computed, ref } from 'vue';

const selectedCity = ref<City | null>(null);
const location = ref<ILocation | null>(null);

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
  data: weatherData,
  error: weatherDataError,
  isLoading: weatherDataIsLoading,
} = useFetchWeather(currentLocation);

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
  <div class="container">
    <h1 class="text-2xl leading-10 font-semibold">Weather Dashboard</h1>
    <div class="flex flex-col gap-y-2">
      <CityInput @select="handleSelectCity" />
      <CoordinatesInput
        :currentLocation="currentLocation"
        @update:location="handleUpdateLocation"
      />
      <HistoricalDataInput />
      <!-- <button class="bg-blue-500 text-white px-4 py-2 rounded">
        Get Weather Data
      </button> -->
    </div>
    <div v-if="weatherDataIsLoading" class="text-center">
      <p>Loading weather data...</p>
    </div>
    <div v-if="weatherDataError" class="text-red-500 text-center">
      <p>Error loading weather data: {{ weatherDataError }}</p>
    </div>
    <WeatherTable v-if="weatherData" :report="weatherData as WeatherReport" />
  </div>
</template>
