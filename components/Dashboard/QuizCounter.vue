<template>

    <h3>Quiz Counter</h3>
    <div>Total Quizzes: {{ totalQuizzes }}</div>

</template>

<script setup>

const totalQuizzes = ref(0);

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  }
});

totalQuizzes.value = props.userData.length;

</script>

<style scoped>

h3 {
    font-weight: 600;
}



</style>