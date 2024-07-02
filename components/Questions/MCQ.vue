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
const resultClass = ref('');

const getOptions = () => {
    if (!props.quizData) {
        return new Error('No Quiz data');
    } 
    options.value = props.quizData.answers_options.map(option => ({ value: option.id, label: option.value }));
}

getOptions();

watch(() => props.itemResult, (newValue) => {
    if (props.itemResult?.answered === true) {
        console.log(props.itemResult);
        generateResultText();
    } else {
        resultText.value = "";
        resultClass.value = "";
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
        resultText.value = "Correct!";
        resultClass.value = "correct";
    } else {
        resultText.value = "Wrong!";
        resultClass.value = "wrong";
    }
}
</script>

<template>
    <div class="questions-container">
        <img v-if="props.quizData.image_url" :src="props.quizData.image_url" alt="Quiz Image" class="quiz-image" />
        <URadioGroup v-model="selected" :legend="quizData.stem" :options="options" />
            <div class="button-container">
                <UButton class="button-done"
                    v-show="!questionAnswered"
                    @click="$emit('submitItem', selected)"
                >Done</UButton>
            </div>
        <div :class="['result', resultClass]">{{ resultText }}</div>
    </div>
</template>

<style scoped>
.quiz-image {
  max-height: 500px; 
  margin-bottom: 20px; 
  align-self: center;
  border-radius: 10px;
}

.button-done {
  margin-top: 20px; 
}

.result {
    color: #050505;
}

.correct {
    color: green;
}

.wrong {
    color: red;
}
</style>
