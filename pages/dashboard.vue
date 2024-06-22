<template>

<h1>Dashboard of {{user.email}}</h1>

</template>

<script setup>
definePageMeta({
    middleware: ['auth'],
});

const user = useSupabaseUser();

onMounted(() => {
    watchEffect(() => {
        if (!user.value) {
            navigateTo('/user/login');
        }
    });
});

</script>