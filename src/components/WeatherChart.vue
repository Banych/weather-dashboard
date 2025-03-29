<script setup lang="ts">
import type { WeatherReport } from '@domain/models/WeatherReport';
import generateColors from '@utils/generateColors';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale
);

const props = defineProps<{
  report: WeatherReport;
  title: string;
}>();

const generatedColors = computed(() =>
  generateColors(props.report.characteristics.length)
);

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: props.title,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'hour',
        displayFormats: {
          hour: 'MMM d, h:mm a',
        },
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 10,
      },
    },
  },
};

const chartData = computed((): ChartData<'line'> => {
  return {
    labels: props.report.days,
    datasets: props.report.characteristics.map((characteristic, index) => ({
      label: characteristic[0].units,
      data: characteristic.map((data) => data.value),
      tension: 0.1,
      borderColor: generatedColors.value[index],
    })),
  };
});
</script>

<template>
  <div class="w-full">
    <Line :data="chartData" :options="chartOptions" class="w-full" />
  </div>
</template>
