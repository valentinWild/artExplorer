<template>
  <body>
    <div class="container">
      <h1>{{ queryParams.style_category }}</h1>
      <UButton v-if="!quizStarted || quizFinished" @click="initQuiz" class="button">Start new Quiz</UButton>
      <QuestionsProgressBar v-if="quizStarted && !quizFinished" :correct="correctAnswersCount" :incorrect="incorrectAnswersCount" :total="quizTotalItems"/>

      <QuestionsMCQ class="questionsMCQ"
          v-if="quizStarted && !quizFinished && currentQuizItem?.type === 'mcq'"
          :quiz-data="currentQuizItem.content"
          @submit-item="handleItemSubmit"
          :question-answered="quizItemAnswered"
          :item-result="quizItemResult"
          :total-questions="quizTotalItems"
          :current-question-index="currentQuizIndex"
      ></QuestionsMCQ>

      <QuestionsFindPicture class="questionsFindPicture"
          v-if="quizStarted && !quizFinished && (currentQuizItem?.type === 'find_the_wrong_picture' || currentQuizItem?.type === 'find_the_correct_picture')"
          :quiz-data="currentQuizItem.content"
          @submit-item="handleItemSubmit"
          :question-answered="quizItemAnswered"
          :item-result="quizItemResult"
          :total-questions="quizTotalItems"
          :current-question-index="currentQuizIndex"
      ></QuestionsFindPicture>

      <QuestionsTextQuestion class="questionsText"
        v-if="quizStarted && !quizFinished && currentQuizItem?.type === 'text_question'"
        :quiz-data="currentQuizItem.content"
        @submit-item="handleItemSubmit"
        :question-answered="quizItemAnswered"
        :item-result="quizItemResult"
        :total-questions="quizTotalItems"
        :current-question-index="currentQuizIndex"
      ></QuestionsTextQuestion>

      <TimelineQuiz class="timelineQuiz" 
        v-if="quizStarted && !quizFinished && currentQuizItem?.type === 'timeline_quiz'"
        :quiz-data="currentQuizItem.content"
        @submit-item="handleItemSubmit"
        :question-answered="quizItemAnswered"
        :item-result="quizItemResult"
        :total-questions="quizTotalItems"
        :current-question-index="currentQuizIndex"
      ></TimelineQuiz>

      <div class="quiz-result" v-if="quizFinished">
        <img src="/pictures/Pokal.png" alt="Trophy" class="trophy-image" />
        <QuestionsProgressBar :correct="correctAnswersCount" :incorrect="incorrectAnswersCount" :total="quizTotalItems"/>
        <div class="quiz-summary">
          <p>{{ quizResultText }} <br><br> 
          Correct answers: <br> <span class="correct">{{ correctAnswersCount }}</span> out of <span class="total">{{ quizTotalItems }}</span></p>
        </div>
      </div>

      <div>
        <UButton v-if="quizStarted && !quizFinished" @click="loadNextItem" class="button">Next Question</UButton>
      </div>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import QuestionsMCQ from '../../components/Questions/MCQ.vue';
import QuestionsFindPicture from '../../components/Questions/FindPicture.vue';
import QuestionsTextQuestion from '../../components/Questions/TextQuestion.vue';
import TimelineQuiz from '../../components/Questions/TimelineQuiz.vue';
import QuestionsProgressBar from '../../components/Questions/ProgressBar.vue';

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
const correctAnswersCount = ref(0);
const incorrectAnswersCount = ref(0);
const quizResultText = ref(null);
const quizStarted = ref(false);
const quizFinished = ref(false);

const quizPercentage = computed(() => {
  const maxScore = quizTotalItems.value; 
  return Math.round((quizScore.value / maxScore) * 100);
});

onMounted(() => {
  if (route.query.style_category) {
    queryParams.style_category = route.query.style_category;
  }
});

const fetchQuestions = async () => {
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
};

const initQuiz = async () => {
  resetQuiz();
  resetQuizData();
  quizResultText.value = null;
  quizStarted.value = true;
  quizFinished.value = false;
  await fetchQuestions();
};

const resetQuiz = () => {
  currentQuizIndex.value = 0;
  quizData.value = null;
  quizId.value = null;
  quizScore.value = 0;
  currentQuizItem.value = null;
  quizItemAnswered.value = false;
  quizItemResult.value = null;
};

const resetQuizData = () => {
  correctAnswersCount.value = 0;
  incorrectAnswersCount.value = 0;
};

const handleItemSubmit = async (item) => {
  let body = {
    "quiz_id": quizId.value,
    "item": {
      "id": currentQuizItem.value.id,
      "type": currentQuizItem.value.type,
      "quiz_id": quizId.value,
      "answer_ids": [],
      "image_order": [],
      "answer_text": "",
    }
  };

  if (currentQuizItem.value.type === "text_question") {
    body.item.answer_text = item;
  } else if (currentQuizItem.value.type === "timeline_quiz") {
    body.item.image_order = item.image_order;
  } else {
    body.item.answer_ids.push(item);
  }

  const data = await $fetch(submitItemQuery, {
    method: 'POST',
    headers: useRequestHeaders(['cookie']),
    body: body,
  });

  console.log(data[0]);

  if (data[0]?.answered === true) {
    quizItemAnswered.value = true;
    quizItemResult.value = data[0];
    quizScore.value += quizItemResult.value.points;
    if (quizItemResult.value.points > 0.5) {
      correctAnswersCount.value++;
    } else {
      incorrectAnswersCount.value++;
    }
  }
};

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
};

const generateUrl = () => {
  if (route.query.style_category) {
    queryParams.style_category = route.query.style_category;
  }
  const queryString = new URLSearchParams(queryParams).toString();
  return `${baseQuery}${queryString}`;
};

const submitQuizResult = async () => {
  let body = {
    "quiz_id": quizId.value,
  };
  const data = await $fetch(submitQuizResultsQuery, {
    method: 'POST',
    headers: useRequestHeaders(['cookie']),
    body: body,
  });
  quizResultText.value = `You have finished the Quiz with ${quizScore.value} points in total!`;
  quizFinished.value = true;
};
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
  max-width: 1100px;
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

.questionsMCQ,
.questionsFindPicture,
.questionsText,
.questionsTimeline {
  background-color: rgb(255, 255, 255);
  margin: 20px auto;
  padding: 20px;
  max-width: 600px;
  border-radius: 10px;
}

.quiz-result {
  text-align: center;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.trophy-image {
  width: 220px;
  height: auto;
  margin: 20px 0;
}

.quiz-summary {
  margin-top: 20px;
  font-size: medium;
  font-weight: bold;
  text-align: center;
}

.correct {

  font-size: large;
}

.total {

  font-size: large;
}


</style>
