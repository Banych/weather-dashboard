<script setup lang="ts">
import useCitySearch from '@/composables/useCitySearch';
import { DEBOUNCE_TIME } from '@constants/DebounceConstants';
import { City } from '@domain/models/City';
import { debounce } from 'lodash';
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'select', value: City): void;
}>();

const query = ref<string>('');
const selectedCity = ref<City | null>(null);

const { error, isLoading, results } = useCitySearch(query);

const handleSelectCity = (city: City) => {
  selectedCity.value = city;
  query.value = '';

  emit('select', city);
};

const handleFocus = () => {
  if (selectedCity.value) {
    query.value = selectedCity.value.name;
  }
  selectedCity.value = null;
};

const handleQueryChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  query.value = input.value;
};

const debouncedHandleQueryChange = debounce(handleQueryChange, DEBOUNCE_TIME);
</script>

<template>
  <div class="relative max-w-80 w-full">
    <input
      id="city"
      :value="selectedCity?.name ?? query"
      type="text"
      placeholder="Enter city name"
      class="border border-gray-300 rounded p-2 w-full"
      @input="debouncedHandleQueryChange"
      @focus="handleFocus"
    />
    <ul
      v-if="query"
      class="absolute inset-x-0 top-11 border border-black shadow-sm p-2 max-h-52 overflow-y-auto bg-white z-10"
    >
      <li v-if="isLoading" class="text-gray-500">Loading...</li>
      <li v-if="error" class="text-red-500">Error: {{ error }}</li>
      <li
        v-if="!isLoading && !error && results.length === 0 && query.length > 0"
        class="text-gray-500"
      >
        No results found
      </li>
      <li
        v-for="result in results"
        :key="result.id"
        class="cursor-pointer hover:bg-gray-200 p-2"
        @click.prevent="handleSelectCity(result)"
      >
        {{ result.name }}, {{ result.country }}
      </li>
    </ul>
  </div>
</template>
