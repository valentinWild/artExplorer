<template>
  <h1 class="font-semibold font-sans text-xl text-stone-100">Your time studied</h1>
    <div class="cards-container">
    <UCard class="counter">
      <template #header>
        <Placeholder class="one">Today</Placeholder>
      </template>
      <Placeholder class="two">{{ today }}</Placeholder>
    </UCard>
    <UCard class="counter">
      <template #header>
        <Placeholder class="one">Week</Placeholder>
      </template>
      <Placeholder class="two">{{ week }}</Placeholder>
    </UCard>
    <UCard class="counter">
      <template #header>
        <Placeholder class="one">Total</Placeholder>
      </template>
      <Placeholder class="two">{{ total }}</Placeholder>
    </UCard>
  </div>
  </template>
  
  <script setup>
  
  const today = ref(0);
  const week = ref(0);
  const total = ref(0);

  const props = defineProps({
  userData: {
    type: Object,
    required: true,
  }
  });
  

  today.value = new Date().setHours(0, 0, 0, 0);
  week.value = new Date().setHours(0, 0, 0, 0);
  total.value = new Date().setHours(0, 0, 0, 0);

  today.value = props.userData.reduce((acc, curr) => {
    if (curr.created_at && curr.finished) {
      const quizTime = new Date(curr.finished) - new Date(curr.created_at);
      const hours = Math.floor(quizTime / (1000 * 60 * 60));
      const minutes = Math.floor((quizTime % (1000 * 60 * 60)) / (1000 * 60));
      const quizDate = new Date(curr.created_at).setHours(0, 0, 0, 0);
      if (quizDate === today) {
        return acc + quizTime;
      }
    }
    return acc;
  }, 0);


  week.value = props.userData.reduce((acc, curr) => {
    if (curr.created_at && curr.finished) {
      const quizTime = new Date(curr.finished) - new Date(curr.created_at);
      const hours = Math.floor(quizTime / (1000 * 60 * 60));
      const minutes = Math.floor((quizTime % (1000 * 60 * 60)) / (1000 * 60));
      const quizDate = new Date(curr.created_at).setHours(0, 0, 0, 0);
      const oneWeekAgo = new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000;
      if (quizDate >= oneWeekAgo) {
        return acc + quizTime;
      }
    }
    return acc;
  }, 0);

  total.value = props.userData.reduce((acc, curr) => {
    if (curr.created_at && curr.finished) {
      const quizTime = new Date(curr.finished) - new Date(curr.created_at);
      return acc + quizTime;
    }
    return acc;
  }, 0);

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  today.value = formatTime(today.value);
  week.value = formatTime(week.value);
  total.value = formatTime(total.value);


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