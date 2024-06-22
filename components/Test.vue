<template>

    <h2 class="test">Test Komponente</h2>
    <UButton 
        color="primary" 
        variant="outline"
        @click="clickListener"
    >Add 1</UButton>
    <div
        v-if="number == 10 || number == 11"
        :class="number == 11 ? 'eleven' : 'not eleven'"
        class="font-light "
    >Number is 10 or 11</div>
    <UCheckbox v-model="selected" name="notifications" label="Notifications" />
    <UInput v-model="value" />

    <div>{{ number }}</div>
    <div>{{ number2 }}</div>
    <div>{{ selected }}</div>
    <div>{{ value }}</div>

    

</template>

<script setup>

const number = ref(0);
const isTrue = ref(false);
const selected = ref(false);
const value = ref("null");

var number2 = 0;

const clickListener = (param) => {
    number.value++;
    number2++;
}

function getClass(params) {
    if (number.value == 11) {
        return 'eleven';
    }
}


</script>

<style scoped>

test{
    color: blue;
}

.eleven {
    background: green;
}

</style>