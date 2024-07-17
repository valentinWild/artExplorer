<template>
  
  <div class="profile-card">
    <div class="profile-info">
      <img src="public/pictures/Logo.png"></img>
      <h3 style="color: black; font-size: 2em;">{{firstname}} {{lastname}}</h3>
    </div>
    <div class="profile-stats">
      <div class="stat">
        <h3>{{ totalQuizzes }}</h3>
        <h2>Total<br>Quizzes</h2>
      </div>
      <div class="stat">
        <h3>{{ avgTime }}</h3>
        <h2>Average<br>Time</h2>
      </div>
      <div class="stat">
        <h3>{{ score }}</h3>
        <h2>Average<br>Score</h2>
      </div>
    </div>
  </div>


  
  </template>
  
  <script setup>
  
  const totalQuizzes = ref(0);
  const avgTime = ref(0);
  const score = ref(0);
  const firstname = ref(0);
  const lastname = ref(0);
  
  const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
  userInfoData: {
      type: Object,
      required: true,
    },
  });


  totalQuizzes.value = props.userData.length;
  firstname.value = props.userInfoData[0].firstname;
  lastname.value = props.userInfoData[0].lastname;

  avgTime.value = (() => {
    const totalQuizTime = props.userData.reduce((acc, curr) => {
      if (curr.created_at && curr.finished) {
        const quizTime = new Date(curr.finished) - new Date(curr.created_at);
        return acc + quizTime;
      }
      return acc;
    }, 0);
    const averageTime = totalQuizTime / totalQuizzes.value;
    return averageTime;
  })();

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  avgTime.value = formatTime(avgTime.value);

  score.value = ((props.userData.reduce((acc, curr) => acc + curr.score, 0) / props.userData.length) * 100).toFixed(1) + '%';

  </script>
  
  <style scoped>

  .profile-card {
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

  .profile-info {
    text-align: center;
    margin-bottom: 20px;
  
  }

  .profile-info img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }

  .profile-info h3 {
    font-size: 24px;
    font-weight: bold;
    margin-top: 20px;
    color: white; 
  }

  .profile-stats {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .stat {
    flex: 1;
    padding: 10px;
    border-radius: 10px;
    background-color: #121421;
    min-width: 100px;
  }

  h3 {
    font-size: 25px;
    font-weight: bold;
    color: white;
    
  }

  h2 {
    color: white;
    font-size: 15px;
  }


  .stat p {
    font-size: 16px;
    margin-top: 5px;
    color: white; /* Added */
  }

  </style>