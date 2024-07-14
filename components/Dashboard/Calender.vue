<template>
  <h3>Calender</h3>
  <div>
    <label for="month-select">Select Month:</label>
    <select id="month-select" v-model="selectedMonth" @change="updateChart">
      <option v-for="month in months" :key="month.value" :value="month.value">
        {{ month.text }}
      </option>
    </select>
  </div>
  <div class="chart-container">
    <line-chart :chart-data="chartData" :options="chartOptions"></line-chart>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
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
  datasets: [
    {
      label: 'Average Quiz Scores',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      data: [],
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 1,
      ticks: {
        stepSize: 0.1,
      },
    },
  },
};

const selectedMonth = ref(new Date().getMonth() + 1);
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

const updateChart = () => {
  const filteredData = props.userData.filter((quiz) => {
    const quizDate = new Date(quiz.created_at);
    return quizDate.getMonth() + 1 === selectedMonth.value;
  });

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

  chartData.value.labels = labels;
  chartData.value.datasets[0].data = data;
};

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
  height: 200px;
  overflow-x: scroll;
  overflow-y: hidden;
  position: relative;
}

.chart-container canvas {
  width: 1000px !important; /* or a dynamic value based on the number of data points */
  height: 100% !important;
}
</style>