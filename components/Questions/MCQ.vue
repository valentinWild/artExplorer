<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import Icons from '../Icons.vue'; 
import ProgressBar from './ProgressBar.vue'; 

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
    default: 1
  },
  currentQuestionIndex: {
    type: Number,
    required: true,
    default: 0
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

const updateProgress = () => {
}

const getOptions = () => {
  if (!props.quizData || !props.quizData.answers_options) {
    return new Error('No Quiz data');
  }
  options.value = props.quizData.answers_options.map(option => ({ value: option.id, label: option.value }));
}

getOptions();

watch(() => props.itemResult, (newValue) => {
  if (props.itemResult?.answered === true) {
    generateResultText();
    if (props.itemResult.points > 0) {
      correctAnswersCount.value++;
    } else {
      incorrectAnswersCount.value++;
    }
  } else {
    resultText.value = "";
    resultClass.value = "";
    selected.value = null;
  }
});

watch(() => props.quizData, (newValue) => {
  if (props.quizData?.answers_options) {
    getOptions();
    stem.value = props.quizData.stem;
  }
});

const generateResultText = () => {
  const result = props.itemResult;
  if (result.points > 0) {
    resultText.value = "Correct!";
    resultClass.value = "correct";
  } else {
    correctAnswer.value = result.content.correct_answers.map(answer => answer.value).join(', ');
    resultText.value = `Wrong! The correct answer is: ${correctAnswer.value}`;
    resultClass.value = "wrong";
  }
}

const selectOption = (optionValue) => {
  selected.value = optionValue;
  emit('submitItem', selected.value);
}
</script>

<template>
  <div class="questions-container">
    <img v-if="props.quizData.image_url" :src="props.quizData.image_url" alt="Quiz Image" class="quiz-image" />
    <ProgressBar :correct="correctAnswersCount" :incorrect="incorrectAnswersCount" :total="props.totalQuestions" /> 
    <div class="question-stem">{{ stem }}</div>
    <div v-for="option in options" :key="option.value" class="option-container">
      <UButton
        class="option-button"
        :class="{ 'selected': selected === option.value }"
        @click="selectOption(option.value)"
        :disabled="questionAnswered"
      >
        {{ option.label }}
      </UButton>
    </div>
    <div class="result-container" :class="resultClass">
      <Icons v-if="resultClass === 'correct'" class="result-icon" type="happy" />
      <Icons v-if="resultClass === 'wrong'" class="result-icon" type="sad" />
      <span class="result-text">{{ resultText }}</span>
    </div>
  </div>
</template>

    <style scoped>
    .quiz-image {
    max-height: 500px;
    margin-bottom: 1px;
    align-self: center;
    border-radius: 10px;
    }

.question-stem {
    text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #333;
}

.option-container {
  margin-bottom: 8px;
}

.option-button {
  background-color: white;
  color: #333;
  border: 1px solid #bbb;
  padding: 10px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.option-button:hover {
  background-color: #f0f0f0;
  border-color: #999;
}

.option-button.selected {
  background-color: #d3d3d3;
}

.option-button:disabled {
  cursor: not-allowed;
  background-color: #e0e0e0;
  color: #a0a0a0;
  border-color: #ccc;
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
