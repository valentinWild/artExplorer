<template>
    <h1>{{ "QuizTitle" }}</h1>

    <QuestionsMCQ
        :quiz-data="currentQuizItem.content"
        @submit-item="(e) => handleItemSubmit(e)"
        :question-answered="questionAnswered"
        :item-result="quizItemResult"
    ></QuestionsMCQ>


</template>
  
<script setup>
  
const quizQuery = ref('/api/styleQuiz?limit=5');
const submitItemQuery = '/api/submitItem';
const quizData = ref();
const quizId = ref();
const currentQuizIndex = ref(0);
const currentQuizItem = ref();
const quizItemAnswered = ref(false);
const quizItemResult = ref();
  

  const fetchQuestions = async() => {
      const { data } = await useFetch(quizQuery, {
          headers: useRequestHeaders(['cookie'])
      });
      if (data.value) {
          quizData.value = data.value;
          quizId.value = quizData.value[0].quiz_id;
          currentQuizItem.value = quizData.value[currentQuizIndex.value];
          console.log(quizData);
      }
  }

  await fetchQuestions();

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
    }

  } 


  </script>