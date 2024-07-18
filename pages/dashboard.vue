import { Bar }  from 'vue-chartjs'
<template>
    <body>
    <section class="section1">
        <div class="initialText">
            <h1 class="text-5xl text-cyan-300 font-extrabold tracking-normal font-sans">Welcome to your Dashboard</h1>
            <br>
            <h2 class="font-semibold font-sans text-xl text-stone-100">The Art Explorer Learning Analytics Dashboard is your 
                personal gateway to track and visualize your progress as you dive into the world of art. Here, you can 
                monitor your learning journey, celebrate milestones, and gain insights into your achievements..</h2>
        </div>

        <div class="features">
            <span>Progress</span>
            <span class="separator">|</span>
            <span>Milestones</span>
            <span class="separator">|</span>
            <span>Achievements</span>
        </div>

        <DashboardTimeDisplay></DashboardTimeDisplay>

        <DashboardProfileCard
            :user-data="userData"
            :user-info-data="userInfoData"
        ></DashboardProfileCard>

        <DashboardTimeStudied   
            :user-data="userData"
        ></DashboardTimeStudied>

        <DashboardLeaderboard
            :users-info-data="usersInfoData"
        ></DashboardLeaderboard>



       

        <div class="carousel">
            <UCarousel v-slot="{ item }" :items="items" class="full-width-carousel">
                <img :src="item" width="300" height="400" draggable="false">
            </UCarousel>
        </div>

        <div class="row">
        <div class="lineChart">
            <DashboardLineChartView
                :user-data="userData"
            ></DashboardLineChartView>
        </div>
    
        <div class="progressBar">
            <DashboardLearningSetProgress
                :user-data="userData"
            ></DashboardLearningSetProgress>
        </div>
    </div>
    
    <div class="quizCalender">
        <DashboardQuizCalendar
            :user-data="userData"
        ></DashboardQuizCalendar>
    </div>
    
    <div class="row">
        <div class="barChart">
            <DashboardBarChartView
                :user-data="userData"
            ></DashboardBarChartView>
        </div>
    
        <div class="timeChart">
            <DashboardTimeBarChartView
                :user-data="userData"
            ></DashboardTimeBarChartView>
        </div>
    </div>


    </section>

</body>
</template>


<script setup>

// Set the middleware to 'auth' to ensure that the user is authenticated before accessing the page
definePageMeta({
    middleware: ['auth'],
});

const user = useSupabaseUser();
const baseUrlUserData = '/api/userData';
const baseUrlUserInfoData = '/api/userInfoData';
const baseUrlUsersInfoData = '/api/usersInfoData';
const userData = ref();
const userInfoData = ref();
const usersInfoData =ref();


// get the user data from the table users
const fetchUserData = async () => {

    const data = await $fetch(baseUrlUserData, {
      method: 'GET',
      headers: useRequestHeaders(['cookie']),
    });

    return data;
}

userData.value = await fetchUserData();

// Get Infos from the user from table users_info 
const fetchUserInfoData = async () => {
    const userInfoData = await $fetch(baseUrlUserInfoData, {
        method: 'GET',
        headers: useRequestHeaders(['cookie']),
    });

    return userInfoData;
}
userInfoData.value = await fetchUserInfoData();

// Get Infos from all users from table users_info
const fetchUsersInfoData = async () => {
    const usersInfoData = await $fetch(baseUrlUsersInfoData, {
        method: 'GET',
        headers: useRequestHeaders(['cookie']),
    });

    return usersInfoData;
}
usersInfoData.value = await fetchUsersInfoData();


onMounted(() => {
    watchEffect(() => {
        // Check if the user is not logged in
        if (!user.value) {
            // Redirect the user to the login page
            navigateTo('/user/login');
        }
    });
});


</script>

<style scoped>

body{
    background-color: #121421;
}

.section1{
    background-image: url('/public/pictures/Background.png');
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem; 
    text-align: center;
    padding-left:5rem;
    padding-right: 5rem;
    padding-top: 5rem;
    padding-bottom: 5rem;
}

.features {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem; 
  font-size: 1rem; 
  color: white; 
  margin-top: 2rem;
}

.separator {
  color: #06B6D4; 
}

.time {
    font-size: 2em;
    color: white;
}

body {
        background-color: #121421;
    }
    
    .quizCounter {
        margin-bottom: 3rem;
    }
    
    .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3rem;
    }
    
    .lineChart,
    .progressBar {
        flex: 1;
        margin-right: 1rem;
    }
    
    .lineChart:last-child {
        margin-right: 0;
    }
    
    .barChart,
    .timeChart {
        flex: 1;
        margin-right: 1rem;
    }
    
    .barChart:last-child {
        margin-right: 0;
    }
    
    .quizCalender {
        margin-bottom: 3rem;
    }


</style>