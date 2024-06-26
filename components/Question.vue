<script setup>

    const props = defineProps({
        quizData: {
            type: Object,
            required: true,
        }
    });

    const emit = defineEmits(['submitItem']);

    const stem = ref();
    const options = ref([]);
    const selected = ref();


    const getOptions = () => {
        if (!props.quizData) {
            return new Error('No Quiz data');
        } 
        console.log(props.quizData.answers_options);
        options.value = props.quizData.answers_options.map(option => ({ value: option.id, label: option.value }));
    }

    getOptions();

/*     const options = [
        {
            value: 'email',
            label: 'Email',
        },
        {
            value: 'sms',
            label: 'Phone (SMS)',
        },
        {
            value: 'push',
            label: 'Push notification',
        },
    ]; */



</script>

<template>
    <div>
        <img v-if="props.quizData.image_url" :src="props.quizData.image_url" alt="Quiz Image" />
        <URadioGroup v-model="selected" :legend="quizData.stem" :options="options" />
        <UButton @click="$emit('submitItem', selected)">Done</UButton>
    </div>
</template>