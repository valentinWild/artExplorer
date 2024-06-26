<script setup>

    const props = defineProps({
        quizData: {
            type: Object,
            required: true,
        },
        questionAnswered: {
            type: Boolean,
            required: true,
        },
        itemResult: {
            type: Object,
            required: false,
        }
    });

    const emit = defineEmits(['submitItem']);

    const stem = ref();
    const options = ref([]);
    const selected = ref();
    const resultText = ref('');

    const getOptions = () => {
        if (!props.quizData) {
            return new Error('No Quiz data');
        } 
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

    watch(() => props.itemResult, (newValue) => {
        if (props.itemResult?.answered === true) {
            console.log(props.itemResult);
            generateResultText();
        } else {
            resultText.value = "";
            selected.value = null;
        }
    });

    watch(() => props.quizData, (newValue) => {
        if (props.quizData?.answers_options) {
            getOptions();
        } else {

        }
    });

    const generateResultText = () => {
        const result = props.itemResult;
        if (result.points > 0) {
            resultText.value = "Correct!"
        } else {
            resultText.value = "Wrong!"
        }
    }

</script>

<template>
    <div>
        <img v-if="props.quizData.image_url" :src="props.quizData.image_url" alt="Quiz Image" />
        <URadioGroup v-model="selected" :legend="quizData.stem" :options="options" />
        <UButton 
            v-show="!questionAnswered"
            @click="$emit('submitItem', selected)"
        >Done</UButton>
        <div class="result">{{ resultText }}</div>
    </div>
</template>