<template>
  <div class="learning-set-progress">
    <div class="header">
      <h3>My Learning Progress per Learning Set</h3>
      <div class="info-icon" @mouseover="showTooltip" @mouseleave="hideTooltip">i</div>
    </div>
    <div v-if="tooltipVisible" class="tooltip">
      This chart shows your progress for each learning set, based on your quiz results. Your exercise is considered 100% when you have completed a quiz set once correctly.
    </div>
    <div v-for="set in learningSets" :key="set.name" class="progress-bar-container">
      <div class="progress-bar-label">{{ set.name }}</div>
      <div class="progress-bar">
        <div class="progress-bar-fill" :style="{ width: set.percentage + '%', backgroundColor: set.color }"></div>
      </div>
      <div class="progress-bar-percentage">{{ set.percentage }}%</div>
    </div>
    <div class="legend">
      <div class="legend-item">
        <div class="color-box" style="background-color: red;"></div>
        <span>0-30%</span>
      </div>
      <div class="legend-item">
        <div class="color-box" style="background-color: orange;"></div>
        <span>31-59%</span>
      </div>
      <div class="legend-item">
        <div class="color-box" style="background-color: lightgreen;"></div>
        <span>60-89%</span>
      </div>
      <div class="legend-item">
        <div class="color-box" style="background-color: green;"></div>
        <span>90-100%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
  userData: {
    type: Array,
    required: true,
  }
});

const learningSets = ref([]);
const tooltipVisible = ref(false);

const getColorByPercentage = (percentage) => {
  if (percentage <= 30) return 'red';
  if (percentage <= 59) return 'orange';
  if (percentage <= 89) return 'lightgreen';
  return 'green';
};

const calculatePercentages = () => {
  const sets = [...new Set(props.userData.map(quiz => quiz.style_category))];
  learningSets.value = sets.map(set => {
    const totalQuizzes = props.userData.filter(quiz => quiz.style_category === set).length;
    const totalScore = props.userData
      .filter(quiz => quiz.style_category === set)
      .reduce((acc, quiz) => acc + quiz.score, 0);
    const percentage = totalQuizzes ? (totalScore / totalQuizzes) * 100 : 0;
    return {
      name: set,
      percentage: percentage.toFixed(2),
      color: getColorByPercentage(percentage)
    };
  });
};

const showTooltip = () => {
  tooltipVisible.value = true;
};

const hideTooltip = () => {
  tooltipVisible.value = false;
};

watch(
  () => props.userData,
  () => {
    calculatePercentages();
  },
  { immediate: true }
);
</script>

<style scoped>

.learning-set-progress {
  background: rgba(255, 255, 255, 0.09); 
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  backdrop-filter: blur(10px); 
  -webkit-backdrop-filter: blur(10px); 
  max-width: 650px; 
  width: calc(100% - 2rem); 
  margin-left: 5rem;
  padding: 1rem;
  position: relative; /* Ensure tooltip is positioned relative to this container */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem; 
}

h3 {
  font-weight: bolder;
  font-size: 1.3em;
  color: #FFFFFF; 
  margin: 0; 
}

.info-icon {
  background-color: #1e1e2d;
  color: #00bfff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bolder;
}

.tooltip {
  position: absolute;
  top: 3rem; 
  right: 1rem; 
  background-color: rgba(0, 0, 0, 1);
  color: white;
  padding: 0.5rem;
  border-radius: 5px;
  width: 200px;
  text-align: center;
  z-index: 10; 
}

.legend {
  display: flex;
  justify-content: center;
  margin-top: 3rem; 
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
  color: #FFFFFF;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  border: 1px solid #ddd;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.progress-bar-label {
  flex: 1;
  color: #FFFFFF;
  font-weight: bolder;
}

.progress-bar {
  flex: 1; 
  height: 15px; 
  background-color: #f3f3f3;
  border-radius: 7.5px; 
  overflow: hidden;
  margin: 0 10px;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 7.5px;
}

.progress-bar-percentage {
  flex: 0 0 40px;
  text-align: right;
  color: #FFFFFF;
  font-weight: bolder;
}
</style>