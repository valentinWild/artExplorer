<template>
  <div class="questions-container">
    <div class="question-stem">{{ stem }}</div>
    <div class="options-container">
      <div v-for="option in options" :key="option.id" class="option-container">
        <img
          :src="option.image_url"
          :alt="option.value"
          class="option-image"
          :class="{ 'selected': selected === option.id, 'correct': isCorrect(option.id), 'incorrect': isIncorrect(option.id) }"
          @click="selectOption(option.id)"
          :disabled="questionAnswered"
        />
      </div>
    </div>
    <div class="result-container" :class="resultClass">
      <Icons v-if="resultClass === 'correct'" class="result-icon" type="happy" />
      <Icons v-if="resultClass === 'wrong'" class="result-icon" type="sad" />
      <span class="result-text">{{ resultText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import Icons from '../Icons.vue';

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
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 1,
  },
  currentQuestionIndex: {
    type: Number,
    required: true,
    default: 0,
  },
});

const emit = defineEmits(['submitItem']);

const stem = ref(props.quizData.stem || '');
const options = ref([]);
const selected = ref();
const resultText = ref('');
const resultClass = ref('');
const correctAnswer = ref('');
const correctAnswersCount = ref(0);
const incorrectAnswersCount = ref(0);

const getOptions = () => {
  if (!props.quizData || !props.quizData.answers_options) {
    throw new Error('No Quiz data');
  }
  options.value = props.quizData.answers_options;
};

const isCorrect = (optionId) => props.itemResult?.correct_answers.some(answer => answer.id === optionId);
const isIncorrect = (optionId) => props.itemResult?.answered && !isCorrect(optionId) && selected.value === optionId;

getOptions();

watch(
  () => props.itemResult,
  (newValue) => {
    if (props.itemResult?.answered === true) {
      generateResultText();
      if (props.itemResult.points > 0) {
        correctAnswersCount.value++;
      } else {
        incorrectAnswersCount.value++;
      }
    } else {
      resultText.value = '';
      resultClass.value = '';
      selected.value = null;
    }
  }
);

watch(
  () => props.quizData,
  (newValue) => {
    if (props.quizData?.answers_options) {
      getOptions();
      stem.value = props.quizData.stem;
    }
  }
);

const generateResultText = () => {
  const result = props.itemResult;
  if (result.points > 0) {
    resultText.value = 'Correct!';
    resultClass.value = 'correct';
  } else {
    correctAnswer.value = result.content.correct_answers.map((answer) => answer.value).join(', ');
    resultText.value = `Wrong! The correct answer is: ${correctAnswer.value}`;
    resultClass.value = 'wrong';
  }
};

const selectOption = (optionValue) => {
  selected.value = optionValue;
  emit('submitItem', selected.value);
};
</script>

<style scoped>
.option-image {
  max-height: 200px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: border 0.3s;
}
.option-image.selected {
  border: 3px solid gray;
}
.option-image.correct {
  border: 3px solid green;
}
.option-image.incorrect {
  border: 3px solid red;
}
.result-container {
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.correct {
  background-color: lightgreen;
  color: rgb(0, 118, 0);
}
.wrong {
  background-color: lightcoral;
  color: rgb(104, 0, 0);
}
.result-icon {
  margin-right: 5px;
  vertical-align: middle;
}
.result-text {
  display: inline-block;
}
</style>