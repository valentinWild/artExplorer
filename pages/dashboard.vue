<template>

<body>

<h1>Dashboard of {{user.email}}</h1>

<div class="quizCounter">

<DashboardQuizCounter
    :user-data="userData"
></DashboardQuizCounter>
</div>

<div class="lineChart"><
<DashboardLineChartView
    :user-data="userData"
></DashboardLineChartView>
</div>

<div class="quizCalender">
<DashboardQuizCalendar
    :user-data="userData"
></DashboardQuizCalendar>
</div>

<div class="progressBar">

<DashboardLearningSetProgress
    :user-data="userData"
></DashboardLearningSetProgress>
</div>

</body>

</template>

<script setup>

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
        if (!user.value) {
            navigateTo('/user/login');
        }
    });
});

</script>

<style scoped>

body{
    background-color: #121421;
}

.quizCounter{
    margin-bottom: 3rem;
}

.lineChart{
    margin-bottom: 3rem;
}

.quizCalender{
    margin-bottom: 3rem;
}

.progressBar{
    margin-bottom: 3rem;
}


</style>