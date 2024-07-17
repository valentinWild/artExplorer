<template>
  <div class="container-all">
    <h1>Your time studied</h1>
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
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  today.value = formatTime(today.value);
  week.value = formatTime(week.value);
  total.value = formatTime(total.value);


  </script>
  
  <style scoped>
  
  .container-all {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: white;
    border: 2px solid white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  .cards-container {
    display: flex;
    flex-direction: row;  
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: white;
    gap: 20px;
  }

  .counter {
    flex: 1;
    min-width: 200px;
    max-width: 300px; 
    background-color: #121421;
    border: black;
  }

  h1 {
    font-size: 2em;
    font-weight: bold;
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