<script setup lang="ts">
import CityInput from '@components/CityInput.vue';
import CoordinatesInput from '@components/CoordinatesInput.vue';
import { type ILocation } from '@domain/interfaces/ILocation';
import type { City } from '@domain/models/City';
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

const handleChangeLatitude = (latitude: number) => {
  if (location.value) {
    location.value.latitude = latitude;
  } else {
    location.value = { latitude, longitude: 0 };
  }
};

const handleChangeLongitude = (longitude: number) => {
  if (location.value) {
    location.value.longitude = longitude;
  } else {
    location.value = { latitude: 0, longitude };
  }
};
const handleSelectCity = (city: City) => {
  selectedCity.value = city;
  location.value = city;
};
</script>

<template>
  <div class="container">
    <h1>Weather Dashboard</h1>
    <div class="flex flex-col gap-y-2">
      <CityInput @select="handleSelectCity" />
      <CoordinatesInput
        :currentLocation="currentLocation"
        @update:latitude="handleChangeLatitude"
        @update:longitude="handleChangeLongitude"
      />
      <HistoricalDatInput />
    </div>
  </div>
</template>
