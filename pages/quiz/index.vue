<template>
    <body>
      <div class="container">
        <h1>{{ queryParams.style_category }}</h1>
        <UButton @click="initQuiz" class="button">Start new Quiz</UButton>
  
        <QuestionsMCQ class="questionsMCQ"
            v-if="currentQuizItem?.type === 'mcq'"
            :quiz-data="currentQuizItem.content"
            @submit-item="handleItemSubmit"
            :question-answered="quizItemAnswered"
            :item-result="quizItemResult"
            :total-questions="quizTotalItems"
            :current-question-index="currentQuizIndex"
        ></QuestionsMCQ>

        <QuestionsFindTheWrongPicture class="findTheWrongPicture"
        v-if="currentQuizItem?.type === 'find_the_wrong_picture'"
        :quiz-data="currentQuizItem.content"
        @submit-item="handleItemSubmit"
        :question-answered="quizItemAnswered"
        :item-result="quizItemResult"
        :total-questions="quizTotalItems"
        :current-question-index="currentQuizIndex"
      ></QuestionsFindTheWrongPicture>

        <div class="quiz-result" v-if="quizResultText">
          {{ quizResultText }}
        </div>
  
        <div>
          <UButton @click="loadNextItem" class="button">Next Question</UButton>
        </div>
      </div>
    </body>
  </template>
  
<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import QuestionsMCQ from '../../components/Questions/MCQ.vue';
import QuestionsFindTheWrongPicture from '../../components/Questions/FindTheWrongPicture.vue';


const route = useRoute();

const baseQuery = '/api/styleQuiz?';
const queryParams = reactive({
  limit: 10,
  style_category: 'Modernism'
});

const submitItemQuery = '/api/submitItem';
const submitQuizResultsQuery = '/api/submitQuizResults';
const quizData = ref();
const quizId = ref();
const currentQuizIndex = ref(0);
const currentQuizItem = ref();
const quizItemAnswered = ref(false);
const quizItemResult = ref();
const quizTotalItems = ref(0);
const quizScore = ref(0);
const quizResultText = ref(null);

onMounted(() => {
    if (route.query.style_category) {
        queryParams.style_category = route.query.style_category;
    }
});


const fetchQuestions = async() => {
    const url = generateUrl();
    const { data } = await useFetch(url, {
        headers: useRequestHeaders(['cookie'])
    });
    if (data.value) {
      quizData.value = data.value;
      quizId.value = quizData.value[0].quiz_id;
      currentQuizItem.value = quizData.value[currentQuizIndex.value];
      quizTotalItems.value = quizData.value.length;
      console.log(quizData);
    }
  }
  
  const initQuiz = async () => {
    resetQuiz();
    quizResultText.value = null;
    await fetchQuestions();
  }
  
  const resetQuiz = () => {
    currentQuizIndex.value = 0;
    quizData.value = null;
    quizId.value = null;
    quizScore.value = 0;
    currentQuizItem.value = null;
    quizItemAnswered.value = false;
    quizItemResult.value = null;
  }
  
  const handleItemSubmit = async (item) => {
    let body = {
      "quiz_id": quizId.value,
      "item": {
        "id": currentQuizItem.value.id,
        "type": currentQuizItem.value.type,
        "quiz_id": quizId.value,
        "answer_ids": [],
      }
    };
    body.item.answer_ids.push(item);
  
    const data = await $fetch(submitItemQuery, {
      method: 'POST',
      headers: useRequestHeaders(['cookie']),
      body: body,
    });
  
    if (data[0]?.answered === true) {
    quizItemAnswered.value = true;
    console.log(data[0]);
    quizItemResult.value = data[0];
    quizScore.value += quizItemResult.value.points;
      console.log(quizScore.value);
      console.log(quizTotalItems.value);
    }
  }
  
  const loadNextItem = async () => {
    currentQuizIndex.value++;
    console.log(currentQuizIndex.value);
    console.log(quizTotalItems.value);
    if (currentQuizIndex.value < quizTotalItems.value) {
      currentQuizItem.value = quizData.value[currentQuizIndex.value];
      quizItemAnswered.value = false;
      quizItemResult.value = null;
    } else {
      await submitQuizResult();
    }
  }

const generateUrl = () => {
    if (route.query.style_category) {
        queryParams.style_category = route.query.style_category;
    }
    const queryString = new URLSearchParams(queryParams).toString()
    return `${baseQuery}${queryString}`
}
  
  const submitQuizResult = async () => {
    let body = {
      "quiz_id": quizId.value,
    };
    const data = await $fetch(submitQuizResultsQuery, {
      method: 'POST',
      headers: useRequestHeaders(['cookie']),
      body: body,
    });
    quizResultText.value = `You have finished the Quiz with ${quizScore.value} points in total!`
    resetQuiz();
  }
  </script>
  
  <style scoped>
  body {
    background-color: #121421;
    color: #ffffff;
    margin: 0;
  }
  
  .container {
    background-color: #121421;
    color: #ffffff;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  h1 {
    color: #ffffff;
    font-weight: bold;
    font-size: x-large;
    margin-bottom: 20px;
  }
  
  .button {
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px 0;
  }
  
  .questionsMCQ {
    background-color: rgb(255, 255, 255);
    margin: 20px auto;
    padding: 20px;
    max-width: 600px;
    border-radius: 10px;
  }
  </style>
  