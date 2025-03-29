<script setup lang="ts">
import { WeatherReport } from '@domain/models/WeatherReport';
import { format } from 'date-fns';

defineProps<{
  report: WeatherReport;
}>();
</script>

<template>
  <div class="py-4">
    <h3 class="text-lg font-semibold mb-4">
      <slot name="title" />
    </h3>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th class="px-4 py-2 border-b">Characteristic</th>
            <th
              v-for="item in report.days"
              :key="item.toISOString()"
              class="px-4 py-2 border-b"
            >
              <div class="flex flex-col">
                <span>{{ format(new Date(item), 'dd/MM/yyyy') }}</span>
                <span class="text-sm text-gray-500">{{
                  format(new Date(item), 'HH:mm')
                }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(characteristic, index) in report.characteristics"
            :key="index"
          >
            <td class="px-4 py-2 border-b">
              {{ characteristic[0].units }}
            </td>
            <td
              v-for="item in characteristic"
              :key="item.toString()"
              class="px-4 py-2 border-b"
            >
              {{ item.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
