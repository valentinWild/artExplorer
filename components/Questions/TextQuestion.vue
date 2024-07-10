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
const answerText = ref("");
const resultText = ref('');
const resultClass = ref('');
const correctAnswer = ref('');
const correctAnswersCount = ref(0);
const incorrectAnswersCount = ref(0);



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
    answerText.value = "";
  }
});

watch(() => props.quizData, (newValue) => {
  if (props.quizData?.stem) {
    stem.value = props.quizData.stem;
  }
});

const generateResultText = () => {
  const result = props.itemResult;
  if (result.points == 1) {
    resultText.value = "Correct!";
    resultClass.value = "correct";
  } 
  else if (result.points < 1){
    correctAnswer.value = result.content.correct_answers;
    resultText.value = correctAnswer.value;
    resultClass.value = "wrong";
  }
}

const submitAnswer = () => {
  emit('submitItem', answerText.value);
}

</script>

<template>
  <div class="questions-container">
    <div class="question-stem">{{ stem }}</div>
    <div class="inputWrapper">
        <UTextarea
            placeholder="Your answer ..."
            v-model="answerText"
            class="text-input"
        ></UTextarea>
        <UButton
            @click="submitAnswer"
            icon="i-heroicons-check-16-solid"
            variant="outline"
            class="submit-button"
        >Submit Answer</UButton>
    </div>

    <div class="result-container" :class="resultClass">
      <Icons v-if="resultClass === 'correct'" class="result-icon" type="happy" />
      <Icons v-if="resultClass === 'wrong'" class="result-icon" type="sad" />
      <span class="result-text">{{ resultText }}</span>
    </div>
  </div>
</template>

<style scoped>

.inputWrapper {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.text-input {
  width: 100%;
  margin: 1rem 0rem;
}

.submit-button {
  width: max-content;
}

.question-stem {
    text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #333;
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
