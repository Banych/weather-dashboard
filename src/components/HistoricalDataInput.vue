<script setup lang="ts">
import {
  MAX_END_DATE_FORMATTED,
  MAX_START_DATE_FORMATTED,
} from '@constants/TimeConstants';
import { ref, watch } from 'vue';

defineProps<{
  startDate: string | null;
  endDate: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:startDate', startDate: string): void;
  (e: 'update:endDate', endDate: string): void;
}>();

const isHistoricalDataNeeded = ref(false);

const handleStartDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:startDate', target.value);
};

const handleEndDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:endDate', target.value);
};

watch(
  () => isHistoricalDataNeeded.value,
  (newValue) => {
    if (newValue) {
      emit('update:startDate', MAX_START_DATE_FORMATTED);
      emit('update:endDate', MAX_END_DATE_FORMATTED);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex items-center gap-x-2">
    <input
      id="historicalData"
      v-model="isHistoricalDataNeeded"
      type="checkbox"
      class="border border-gray-300 rounded"
    />
    <label for="historicalData">Include Historical Data</label>
    <template v-if="isHistoricalDataNeeded">
      <label for="startDate">Start Date:</label>
      <input
        id="startDate"
        type="date"
        :value="startDate"
        class="border border-gray-300 rounded px-2 py-1"
        :max="endDate ?? MAX_END_DATE_FORMATTED"
        @change="handleStartDateChange"
      />
      <label for="endDate">End Date:</label>
      <input
        id="endDate"
        type="date"
        :value="endDate"
        :max="MAX_END_DATE_FORMATTED"
        class="border border-gray-300 rounded px-2 py-1"
        @change="handleEndDateChange"
      />
    </template>
  </div>
</template>
