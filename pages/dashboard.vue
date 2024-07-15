<template>
    <body>
    <section class="section1">
        <div class="initialText">
            <h1 class="text-5xl text-cyan-300 font-extrabold tracking-normal font-sans">Welcome to the Dashboard {{user.email}}</h1>
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

        <DashboardQuizzesGeneralInformation
            :user-data="userData"
        ></DashboardQuizzesGeneralInformation>

       

        <div class="carousel">
            <UCarousel v-slot="{ item }" :items="items" class="full-width-carousel">
                <img :src="item" width="300" height="400" draggable="false">
            </UCarousel>
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
const baseUrl = '/api/userData';
const userData = ref();

const fetchUserData = async () => {

    const data = await $fetch(baseUrl, {
      method: 'GET',
      headers: useRequestHeaders(['cookie']),
    });

    return data;
}

userData.value = await fetchUserData();



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






</style>