<template>

    <h3>Calender</h3>
    <div>Calender: {{ props.userData}}</div>

</template>

<script setup>

const totalQuizzes = ref(0);

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  }
});

console.log(props.userData);

totalQuizzes.value = props.userData.length;

</script>

<style scoped>

h3 {
    font-weight: 600;
}



</style>