<template>
  <div class="learning-set-progress">
    <h3>Learning Sets</h3>
    <div v-for="set in learningSets" :key="set.name" class="progress-bar-container">
      <div class="progress-bar-label">{{ set.name }}</div>
      <div class="progress-bar">
        <div class="progress-bar-fill" :style="{ width: set.percentage + '%', backgroundColor: set.color }"></div>
      </div>
      <div class="progress-bar-percentage">{{ set.percentage }}%</div>
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
  width: 25%;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.progress-bar-label {
  flex: 1;
}

.progress-bar {
  flex: 1; /* Reduce the flex value to make the bar shorter */
  height: 15px; /* Reduce the height of the progress bar */
  background-color: #f3f3f3;
  border-radius: 7.5px; /* Match the border radius to the new height */
  overflow: hidden;
  margin: 0 10px;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 7.5px; /* Match the border radius to the new height */
}

.progress-bar-percentage {
  flex: 0 0 40px;
  text-align: right;
}
</style>