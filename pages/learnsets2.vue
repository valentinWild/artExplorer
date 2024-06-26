<template>
    <div>{{ response }}</div>
</template>

<script setup>

import axios from 'axios';
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    console.log(user.value.id);

    const response = await axios.get('http://localhost:3000/api/styleQuiz?limit=5');

    console.log(response);

</script>

<style>


</style>
