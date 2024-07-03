<template>
    <h1>{{ "QuizTitle" }}</h1>
    <UButton
        @click="initQuiz"
    >Start new Quiz</UButton>

    <QuestionsMCQ
        v-if="currentQuizItem?.type === 'mcq'"
        :quiz-data="currentQuizItem.content"
        @submit-item="(e) => handleItemSubmit(e)"
        :question-answered="questionAnswered"
        :item-result="quizItemResult"
    ></QuestionsMCQ>

    <div
        class="quiz-result"
        v-if="quizResultText"
    >{{ quizResultText }}</div>

    <div>
        <UButton
            @click="loadNextItem"
        >Next Question</UButton>
    </div>


</template>
  
<script setup>

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

const initQuiz = async() => {
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

const handleItemSubmit = async(item) => {
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

const loadNextItem = async() => {
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

const submitQuizResult = async () => {
    let body = {
    "quiz_id": quizId.value,
    };
    const data = await $fetch(submitQuizResultsQuery, {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
        body: body,
    });
    if (data?.score) {
        resetQuiz();
        quizResultText.value = `You have finished the Quiz with ${data.totalPoints} points in total and a score of ${data.score}!`
    }
}

const generateUrl = () => {
    if (route.query.style_category) {
        queryParams.style_category = route.query.style_category;
    }
    const queryString = new URLSearchParams(queryParams).toString()
    return `${baseQuery}${queryString}`
}


</script>