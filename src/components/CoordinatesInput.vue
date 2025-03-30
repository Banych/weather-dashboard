<script setup lang="ts">
import useGeolocation from '@composables/useGeolocation';
import { DEBOUNCE_TIME } from '@constants/DebounceConstants';
import type { ILocation } from '@domain/interfaces/ILocation';
import { debounce } from 'lodash';
import { LocateFixed, MapPin } from 'lucide-vue-next';

const props = defineProps<{
  currentLocation: ILocation | null;
}>();

const { error, getLocation, isLoading } = useGeolocation();

const emit = defineEmits<{
  (e: 'update:location', location: ILocation): void;
}>();

const handleLatitudeChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = parseFloat(input.value);
  if (!isNaN(value)) {
    emit('update:location', {
      ...(props.currentLocation || { latitude: 0, longitude: 0 }),
      latitude: value,
    });
  }
};

const handleLongitudeChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = parseFloat(input.value);
  if (!isNaN(value)) {
    emit('update:location', {
      ...(props.currentLocation || { latitude: 0, longitude: 0 }),
      longitude: value,
    });
  }
};

const handleClickGetLocation = async () => {
  try {
    const location = await getLocation();
    if (location) {
      emit('update:location', {
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } else {
      console.error('Location not found');
    }
  } catch (err) {
    console.error('Error getting location:', err);
  }
};

const debouncedHandleClickGetLocation = debounce(
  handleClickGetLocation,
  DEBOUNCE_TIME
);
</script>

<template>
  <div class="flex items-center gap-x-2">
    <MapPin class="s-6 ml-2" />
    <input
      id="latitude"
      type="number"
      placeholder="Enter latitude"
      class="border border-gray-300 rounded p-2"
      :value="currentLocation?.latitude ?? ''"
      @input="handleLatitudeChange"
    />
    <input
      id="longitude"
      type="number"
      placeholder="Enter longitude"
      class="border border-gray-300 rounded p-2"
      :value="currentLocation?.longitude ?? ''"
      @input="handleLongitudeChange"
    />
    <button
      class="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
      :disabled="isLoading"
      :class="{ 'cursor-not-allowed': isLoading, 'bg-red-800': error }"
      :title="error ? 'Error getting location' : ''"
      @click.stop="debouncedHandleClickGetLocation"
    >
      <LocateFixed class="s-5" />
    </button>
  </div>
</template>
