<template>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { Chart, registerables } from 'chart.js';
  
  Chart.register(...registerables);
  
  const props = defineProps({
    chartData: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  });
  
  const canvas = ref(null);
  let chartInstance = null;
  
  const renderChart = () => {
    if (chartInstance) {
      chartInstance.destroy();
    }
    chartInstance = new Chart(canvas.value.getContext('2d'), {
      type: 'line',
      data: props.chartData,
      options: props.options,
    });
  };
  
  onMounted(() => {
    renderChart();
  });
  
  watch(
    () => props.chartData,
    () => {
      renderChart();
    },
    { deep: true }
  );
  </script>
  
  <style scoped>
  canvas {
    max-width: 100%;
  }
  </style>