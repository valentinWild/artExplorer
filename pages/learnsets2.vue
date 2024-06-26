<template>
    <div>{{ quizData }}</div>
    <UButton
        @click="fetchQuestions"
    >Fetch Questions</UButton>
</template>

<script setup>

    const quizData = ref();

    const { data } = await useFetch('api/styleQuiz?limit=5', {
        headers: useRequestHeaders(['cookie'])
    });

    const fetchQuestions = async() => {
        const { data } = await useFetch('api/styleQuiz?limit=5', {
            headers: useRequestHeaders(['cookie'])
        });

        if (data.value) {
            quizData.value = data.value;
            console.log(quizData.value);
        }
    }



</script>

<style>


</style>
