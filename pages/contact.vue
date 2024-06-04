<template>
    <div>
        <h1>Contact Page</h1>
    </div>
    
    <UButton>Contact us Now</UButton>

    <UInput
        v-model="value"
    ></UInput>

    <span>{{ value }}</span>

</template>

<script setup>

const value = ref('');

</script>