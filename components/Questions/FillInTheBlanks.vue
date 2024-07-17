<template>
  <div class="container">
    <h1>Fill in the Blanks</h1>
    <div class="content" v-html="formattedTextWithInputs"></div>
    <div class="controls">
      <button @click="fetchAndFormatWikiText" class="button">Fetch Wikipedia Text</button>
      <button @click="checkAnswers" class="button" :disabled="questionAnswered">Check Answers</button>
      <button @click="nextQuiz" class="button" v-if="showNextButton">Next</button>
    </div>
    <div v-if="resultMessage" class="result-container" :class="resultClass">
      <Icons v-if="resultClass === 'correct'" class="result-icon" type="happy" />
      <Icons v-if="resultClass === 'wrong'" class="result-icon" type="sad" />
      <span class="result-text">{{ resultMessage }}</span>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import Icons from '../Icons.vue';
import { fetchWikiText } from '../server/utils/fillInTheBlanks';

export default {
  name: 'FillInTheBlanks',
  components: { Icons },
  props: ['quizData', 'questionAnswered', 'itemResult', 'totalQuestions', 'currentQuestionIndex'],
  setup(props, { emit }) {
    const originalText = ref('');
    const formattedText = ref('');
    const userAnswers = reactive({});
    const correctAnswers = ref([]);
    const resultMessage = ref('');
    const resultClass = ref('');
    const showNextButton = ref(false);

    const formattedTextWithInputs = computed(() => {
      if (!formattedText.value) return '';
      return formattedText.value.replace(/__blank_(\d+)__/g, (match, p1) => {
        const index = p1;
        return `<input type="text" id="blank_${index}" class="blank" v-model="userAnswers['blank_${index}']" />`;
      });
    });

    const initializeQuiz = () => {
      if (props.quizData && props.quizData.text) {
        originalText.value = props.quizData.text;
        const { formattedText: formatted, correctAnswers: correct } = createBlanksFromText(originalText.value);
        formattedText.value = formatted;
        correctAnswers.value = correct;
      }
    };

    onMounted(initializeQuiz);
    watch(() => props.quizData, initializeQuiz);

    const fetchAndFormatWikiText = async () => {
      const data = await fetchWikiText();
      if (data) {
        originalText.value = getRandomSentence(data);
        const { formattedText: formatted, correctAnswers: correct } = createBlanksFromText(originalText.value);
        formattedText.value = formatted;
        correctAnswers.value = correct;
      } else {
        formattedText.value = 'Error fetching data';
      }
    };

    const getRandomSentence = (text) => {
      const sentences = text.split('. ');
      const validSentences = sentences.filter(sentence => sentence.split(' ').some(word => word.length > 3));
      const randomIndex = Math.floor(Math.random() * validSentences.length);
      return validSentences[randomIndex] + '.';
    };

    const createBlanksFromText = (text) => {
      const words = text.split(' ');
      const blankIndices = getRandomIndices(words, 3, 3); // Maximum 3 blanks

      const correctAnswers = [];
      blankIndices.forEach((index, blankIndex) => {
        correctAnswers.push(words[index]);
        words[index] = `__blank_${blankIndex}__`;
      });

      const formattedText = words.join(' ');
      return { formattedText, correctAnswers };
    };

    const getRandomIndices = (words, num, minWordLength) => {
      const indices = [];
      while (indices.length < num) {
        const index = Math.floor(Math.random() * words.length);
        if (!indices.includes(index) && words[index].length > minWordLength && !words[index].includes('<')) {
          indices.push(index);
        }
      }
      return indices.sort((a, b) => a - b);
    };

    const checkAnswers = () => {
      const inputElements = document.querySelectorAll('.blank');
      inputElements.forEach((input, index) => {
        userAnswers[`blank_${index}`] = input.value;
      });

      let correctCount = 0;
      let totalBlanks = correctAnswers.value.length;

      correctAnswers.value.forEach((correctAnswer, index) => {
        console.log(`Checking: User Answer - ${userAnswers[`blank_${index}`]}, Correct Answer - ${correctAnswer}`);
        if (userAnswers[`blank_${index}`]?.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
          correctCount++;
        }
      });

      resultMessage.value = `You got ${correctCount} out of ${totalBlanks} correct!`;
      resultClass.value = correctCount === totalBlanks ? 'correct' : 'wrong';
      showNextButton.value = true;
      emit('submitItem', { id: props.quizData.id, answer_text: JSON.stringify(userAnswers) });
    };

    const nextQuiz = () => {
      emit('next-quiz');
    };

    return {
      formattedTextWithInputs,
      fetchAndFormatWikiText,
      checkAnswers,
      resultMessage,
      resultClass,
      userAnswers,
      showNextButton,
      nextQuiz,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
}

h1 {
  color: #333;
  font-size: x-large;
  margin-bottom: 20px;
}

.content {
  text-align: left;
  margin-top: 20px;
  font-size: medium;
  color: #333;
}

.blank {
  border: 1px solid #333;
  padding: 5px;
  font-size: medium;
}

.controls {
  margin-top: 20px;
}

.button {
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  color: white;
  font-weight: bold;
  background-color: #007bff;
}

.button:hover {
  background-color: #0056b3;
}

.result-container {
  margin-top: 20px;
  font-size: large;
  padding: 10px;
  border-radius: 5px;
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
