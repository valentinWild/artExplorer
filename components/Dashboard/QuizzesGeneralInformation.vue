<template>
<h1 class="font-semibold font-sans text-xl text-stone-100">General Information</h1>
    <div class="cards-container">
    <UCard class="counter">
      <template #header>
        <Placeholder class="one">Total Quizzes</Placeholder>
      </template>
      <Placeholder class="two">{{ totalQuizzes }}</Placeholder>
    </UCard>
    <UCard class="counter">
      <template #header>
        <Placeholder class="one">Overall Score</Placeholder>
      </template>
      <Placeholder class="two">{{ score }}</Placeholder>
    </UCard>
    <UCard class="counter">
      <template #header>
        <Placeholder class="one">Total Time Studied</Placeholder>
      </template>
      <Placeholder class="two">{{ avgTime }}</Placeholder>
    </UCard>
  </div>
  </template>
  
  <script setup>
  
  const totalQuizzes = ref(0);
  const avgTime = ref(0);
  const score = ref(0);
  
  const props = defineProps({
  userData: {
    type: Object,
    required: true,
  }
  });
  
  totalQuizzes.value = props.userData.length;

  avgTime.value = (() => {
    const totalQuizTime = props.userData.reduce((acc, curr) => {
      if (curr.created_at && curr.finished) {
        const quizTime = new Date(curr.finished) - new Date(curr.created_at);
        return acc + quizTime;
      }
      return acc;
    }, 0);
    const averageTime = totalQuizTime / totalQuizzes.value;
    const hours = Math.floor(averageTime / (1000 * 60 * 60));
    const minutes = Math.floor((averageTime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  })();

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  avgTime.value = formatTime(avgTime.value);

  score.value = ((props.userData.reduce((acc, curr) => acc + curr.score, 0) / props.userData.length) * 100).toFixed(2) + ' %';

  </script>
  
  <style scoped>
  
  .cards-container {
  display: flex;
  justify-content: space-between;
  gap: 30px; 
}

  .counter {
    flex: 1;
    min-width: 200px;
    max-width: 300px; 
    background-color: #121421;
    border: 1px solid rgb(var(--color-primary-500) / var(--tw-bg-opacity));
  }


.one {
  font-weight: 600;
  color: white;
}

.two {
  color: white;
  font-size: 1.5rem;
  font-weight: 800;

}
  
  </style>