<template>
  <h3>Scores Chart</h3>
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
  <div>
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
    y: {
      min: 0,
      max: 1,
      ticks: {
        stepSize: 0.2,
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
  Impressionism: 'rgba(255, 99, 132, 0.2)',
  Renaissance: 'rgba(54, 162, 235, 0.2)',
  Modernism: 'rgba(75, 192, 192, 0.2)',
  Surrealism: 'rgba(153, 102, 255, 0.2)',
'Pop Art': 'rgba(255, 159, 64, 1)',
  '21st Century': 'rgba(255, 206, 86, 1)',
};

const borderColor = {
  Impressionism: 'rgba(255, 99, 132, 1)',
  Renaissance: 'rgba(54, 162, 235, 1)',
  Modernism: 'rgba(75, 192, 192, 1)',
  Surrealism: 'rgba(153, 102, 255, 1)',
 'Pop Art': 'rgba(255, 159, 64, 1)',
  '21st Century': 'rgba(255, 206, 86, 1)',
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
      borderColor: borderColor[selectedLearningSet.value],
      borderWidth: 1,
      pointRadius: 3,
      pointHoverRadius: 5,
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
      borderColor: borderColor[selectedLearningSet.value],
      borderWidth: 1,
      pointRadius: 3,
      pointHoverRadius: 5,
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
      y: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.2,
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
  font-weight: 600;
}

select {
  margin-bottom: 20px;
}

.chart-container {
  width: 800px;
  height: 400px;
  min-height: 400px; /* Ensure a minimum height */
  position: relative;
}

.chart-container canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>