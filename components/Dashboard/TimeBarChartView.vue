<template>
    <div class="time-chart-container">
      <h3>Average Time Spent on Learning Sets</h3>
      <div class="chart-container">
        <bar-chart :chart-data="chartData" :options="chartOptions"></bar-chart>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import BarChart from './BarChart.vue';
  
  const props = defineProps({
    userData: {
      type: Array,
      required: true,
    }
  });
  
  const chartData = ref({
    labels: [],
    datasets: [],
  });
  
  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF', // White color for X-axis labels
        },
        grid: {
          color: '#FFFFFF', // White color for grid lines
        },
      },
      y: {
        ticks: {
          color: '#FFFFFF', // White color for Y-axis labels
        },
        grid: {
          color: '#FFFFFF', // White color for grid lines
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF', // White color for legend labels
        },
      },
    },
  });
  
  const colors = {
    Impressionism: 'rgba(72, 207, 173, 1)', // Strong Light Green-Blue
    Renaissance: 'rgba(249, 105, 14, 1)', // Strong Bright Orange
    Modernism: 'rgba(255, 195, 0, 1)', // Strong Yellow
    Surrealism: 'rgba(128, 128, 128, 1)', // Strong Gray
    'Pop Art': 'rgba(0, 174, 239, 1)', // Strong Bright Blue
    '21st Century': 'rgba(33, 150, 243, 1)', // Strong Dark Blue
  };
  
  const updateChart = () => {
    const learningSetTimes = props.userData.reduce((acc, quiz) => {
      const startTime = new Date(quiz.created_at);
      const endTime = new Date(quiz.finished);
      const timeSpent = (endTime - startTime) / 60000; // Convert milliseconds to minutes
  
      if (!acc[quiz.style_category]) {
        acc[quiz.style_category] = { totalTime: 0, count: 0 };
      }
      acc[quiz.style_category].totalTime += timeSpent;
      acc[quiz.style_category].count += 1;
      return acc;
    }, {});
  
    const labels = Object.keys(learningSetTimes);
    const data = labels.map(set => (learningSetTimes[set].totalTime / learningSetTimes[set].count).toFixed(2));
  
    chartData.value.labels = labels;
    chartData.value.datasets = [{
      label: 'Average Time Spent (minutes)',
      backgroundColor: labels.map(label => colors[label] || 'rgba(255, 99, 132, 1)'), // Use predefined colors or default color
      borderColor: labels.map(label => colors[label] || 'rgba(255, 99, 132, 1)'),
      borderWidth: 1,
      data: data,
    }];
  };
  
  onMounted(() => {
    updateChart();
  });
  
  watch(
    () => props.userData,
    () => {
      updateChart();
    },
    { immediate: true }
  );
  </script>
  
  <style scoped>
  h3 {
    font-weight: 800;
    font-size: 1.3em;
    color: #FFFFFF;
    text-align: center;
    width: 100%;
    margin-bottom: 2rem;
    margin-top: 1rem;
  }
  
  .chart-container {
    width: 100%;
    min-height: 200px; /* Ensure a minimum height */
    position: relative;
  }
  
  .chart-container canvas {
    width: 100% !important;
    height: 100% !important;
  }
  
  .time-chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.09);
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    max-width: 650px; /* Set maximum width for the container */
    width: calc(100% - 2rem); /* Ensure the container is slightly wider than the chart */
    margin-left: 5rem;
  }
  </style>