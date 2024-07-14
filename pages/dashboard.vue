<template>

<h1>Dashboard of {{user.email}}</h1>

<DashboardQuizCounter
    :user-data="userData"
></DashboardQuizCounter>

<DashboardCalender
    :user-data="userData"
></DashboardCalender>

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