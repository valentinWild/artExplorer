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
  }
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

const updateProgress = () => {}

const getOptions = () => {
  if (!props.quizData || !props.quizData.artworks) {
    return new Error('No Quiz data');
  }
  options.value = props.quizData.artworks.map(option => ({ value: option.id, label: option.image_url, style_title: option.style_title }));

  // Set correctAnswer as the one that doesn't match the epoch
const wrongOption = props.quizData.artworks.find(option => option.style_title !== props.quizData.epoch);
  if (wrongOption) {
    correctAnswer.value = wrongOption.id;
  }
};

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
  if (props.quizData?.artworks) {
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
    const correctOptionIndex = options.value.findIndex(option => option.value === correctAnswer.value);
    resultText.value = "False!";
    resultClass.value = "wrong";
  }
}

const selectOption = (optionValue) => {
  selected.value = optionValue;
  emit('submitItem', { answer_ids: [optionValue] });
}
</script>

<template>
    <div class="questions-container">
      <ProgressBar :correct="correctAnswersCount" :incorrect="incorrectAnswersCount" :total="props.totalQuestions" /> 
      <div class="question-stem">{{ stem }}</div>
      <div class="options-grid">
        <div v-for="option in options" :key="option.value" class="option-container">
          <img
            class="option-image"
            :src="option.label"
            @click="selectOption(option.value)"
            :class="{
              'selected': selected === option.value,
              'correct-border': questionAnswered && option.value === correctAnswer.value,
              'wrong-border': questionAnswered && selected === option.value && option.value !== correctAnswer.value
            }"
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
  
  <style scoped>
  .questions-container {
    background-color: white;
    padding: 20px;
    margin: 20px auto;
    max-width: 600px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .question-stem {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #333;
  }
  
  .options-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    justify-items: center;
  }
  
  .option-container {
    margin: 8px;
  }
  
  .option-image {
  width: 200px; /* Fixed width */
  height: 200px; /* Fixed height */
  object-fit: cover; /* Ensure images maintain aspect ratio */
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

  .option-image.selected {
    border-color: #d3d3d3;
  }
  
  .option-image.correct-border {
    border-color: green;
  }
  
  .option-image.wrong-border {
    border-color: red;
  }
  
  .option-image:disabled {
    cursor: not-allowed;
    opacity: 0.5;
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
  
  .button {
    margin-top: 10px;
  }
  </style>