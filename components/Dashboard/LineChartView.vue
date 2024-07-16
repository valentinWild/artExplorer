<template>
  <div class="score-chart-container">
    <h3>Your Learning Success per Art Epoch Over Time</h3>
    <div class="dropdown-container">
      <div>
        <label for="month-select">Select Month:</label>
        <select id="month-select" v-model="selectedMonth" @change="updateChart">
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.text }}
          </option>
        </select>
      </div>
      <div>
        <label for="learning-set-select">Select Learning Set:</label>
        <select id="learning-set-select" v-model="selectedLearningSet" @change="updateChart">
          <option v-for="set in learningSets" :key="set" :value="set">
            {{ set }}
          </option>
        </select>
      </div>
    </div>
    <div class="radio-buttons-container">
      <label>
        <input type="radio" v-model="viewMode" value="average" @change="updateChart">
        Average Scores
      </label>
      <label>
        <input type="radio" v-model="viewMode" value="all" @change="updateChart">
        All Scores
      </label>
    </div>
    <div class="chart-container">
      <line-chart :chart-data="chartData" :options="chartOptions"></line-chart>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { defineProps } from 'vue';
import LineChart from './LineChart.vue';

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

const selectedMonth = ref(new Date().getMonth() + 1);
const learningSets = ref([...new Set(props.userData.map(quiz => quiz.style_category))]);
const selectedLearningSet = ref(learningSets.value[learningSets.value.length - 1] || '');
const viewMode = ref('average'); // Toggle between 'average' and 'all'

const months = [
  { value: 1, text: 'January' },
  { value: 2, text: 'February' },
  { value: 3, text: 'March' },
  { value: 4, text: 'April' },
  { value: 5, text: 'May' },
  { value: 6, text: 'June' },
  { value: 7, text: 'July' },
  { value: 8, text: 'August' },
  { value: 9, text: 'September' },
  { value: 10, text: 'October' },
  { value: 11, text: 'November' },
  { value: 12, text: 'December' },
];

const colors = {
  Impressionism: 'rgba(72, 207, 173, 1)', // Strong Light Green-Blue
  Renaissance: 'rgba(249, 105, 14, 1)', // Strong Bright Orange
  Modernism: 'rgba(255, 195, 0, 1)', // Strong Yellow
  Surrealism: 'rgba(128, 128, 128, 1)', // Strong Gray
  'Pop Art': 'rgba(0, 174, 239, 1)', // Strong Bright Blue
  '21st Century': 'rgba(33, 150, 243, 1)', // Strong Dark Blue
};

const updateChart = () => {
  const filteredData = props.userData.filter((quiz) => {
    const quizDate = new Date(quiz.created_at);
    const isMonthMatch = quizDate.getMonth() + 1 === selectedMonth.value;
    const isLearningSetMatch = quiz.style_category === selectedLearningSet.value;
    return isMonthMatch && isLearningSetMatch;
  });

  const datasets = [];

  if (viewMode.value === 'average') {
    const groupedData = filteredData.reduce((acc, quiz) => {
      const date = new Date(quiz.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { totalScore: 0, count: 0 };
      }
      acc[date].totalScore += quiz.score;
      acc[date].count += 1;
      return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const data = labels.map(date => (groupedData[date].totalScore / groupedData[date].count).toFixed(2));

    datasets.push({
      label: `${selectedLearningSet.value} Average Scores`,
      backgroundColor: colors[selectedLearningSet.value],
      borderColor: colors[selectedLearningSet.value],
      borderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      data: data,
      fill: false,
    });

    chartData.value.labels = labels;
    chartData.value.datasets = datasets;
  } else {
    const labels = filteredData.map(quiz => new Date(quiz.created_at).toLocaleDateString());
    const data = filteredData.map(quiz => quiz.score.toFixed(2));

    datasets.push({
      label: `${selectedLearningSet.value} Scores`,
      backgroundColor: colors[selectedLearningSet.value],
      borderColor: colors[selectedLearningSet.value],
      borderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      data: data,
      fill: false,
    });

    chartData.value.labels = labels;
    chartData.value.datasets = datasets;
  }

  // Ensure the Y-axis options are updated
  chartOptions.value = {
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
  };
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

watch(
  () => selectedMonth.value,
  () => {
    updateChart();
  }
);

watch(
  () => selectedLearningSet.value,
  () => {
    updateChart();
  }
);

watch(
  () => viewMode.value,
  () => {
    updateChart();
  }
);
</script>

<style scoped>
h3 {
  font-weight: 800;
  font-size: 1.3em;
  color: #FFFFFF; 
  text-align: center; 
  width: 100%; 
  margin-bottom: 3rem; 
  margin-top: 1em;
}

.dropdown-container {
  display: flex;
  gap: 2rem; /* Space between the dropdowns */
  margin-bottom: 2rem; 
  margin-left: 10rem;
}

select {
  background-color: #1e1e2d; 
  color: #ffffff; 
}

label {
  color: #00bfff; 
}

.radio-buttons-container {
  display: flex;
  gap: 2rem; /* Space between the radio buttons */
  margin-bottom: 3rem; 
  margin-left: 16rem;
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

.score-chart-container {
  display: flex;
  flex-direction: column; /* Arrange items in a column */
  align-items: flex-start; 
  gap: 0.5rem; /* Reduce space between items */
  padding: 1rem; 
  background: rgba(255, 255, 255, 0.09); 
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  backdrop-filter: blur(10px); 
  -webkit-backdrop-filter: blur(10px); 
  max-width: 850px; /* Set maximum width for the container */
  width: calc(100% - 2rem); /* Ensure the container is slightly wider than the chart */
  margin-left: 3rem;
}
</style>