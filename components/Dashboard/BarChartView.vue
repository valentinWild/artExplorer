<template>
    <div class="bar-chart-container">
      <h3>Average Learning Success by Learning Set</h3>
      <div class="chart-container">
        <bar-chart :chart-data="chartData" :options="chartOptions"></bar-chart>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import { defineProps } from 'vue';
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
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.2,
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
    const groupedData = props.userData.reduce((acc, quiz) => {
      const category = quiz.style_category;
      if (!acc[category]) {
        acc[category] = { totalScore: 0, count: 0 };
      }
      acc[category].totalScore += quiz.score;
      acc[category].count += 1;
      return acc;
    }, {});
  
    const labels = Object.keys(groupedData);
    const data = labels.map(category => (groupedData[category].totalScore / groupedData[category].count).toFixed(2));
    const backgroundColors = labels.map(category => colors[category]);
  
    const datasets = [{
      label: 'Average Scores',
      backgroundColor: backgroundColors,
      borderColor: backgroundColors,
      borderWidth: 2,
      data: data,
    }];
  
    chartData.value.labels = labels;
    chartData.value.datasets = datasets;
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
  
  .bar-chart-container {
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