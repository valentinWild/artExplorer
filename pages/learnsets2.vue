<template>
    <div class="p-4">
      <div v-for="(question, index) in questions" :key="question.id" class="mb-6">
        <h2 class="text-xl font-bold mb-2">{{ question.content.stem }}</h2>
        <img :src="question.content.image_url" alt="Artwork" class="mb-4 w-full max-w-md" />
        <div>
          <label v-for="option in question.content.answers_options" :key="option.id" class="block mb-2">
            <input type="radio" :name="'question' + question.id" :value="option.id" v-model="selectedAnswers[question.id]" />
            {{ option.value }}
          </label>
        </div>
      </div>
      <button @click="submitAnswers" class="mt-4 p-2 bg-blue-500 text-white rounded">Submit Answers</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  // refs für die Daten
  const questions = ref([]); // Fragen
  const selectedAnswers = ref({}); // ausgewählte Antworten 
  
  // abrufen der Fragen vom Server
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/styleQuiz');
      questions.value = response.data; // Fragen aus der API-Antwort setzen
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  
  // Beim Laden der Komponente Fragen vom Server abrufen
  onMounted(() => {
    fetchQuestions();
  });
  
  // absenden der Antworten ???
  const submitAnswers = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/submitQuiz', {
        quiz_id: 1, // Beispiel-Quiz-ID, anpassen entsprechend der tatsächlichen Quiz-ID
        items: Object.entries(selectedAnswers.value).map(([questionId, answerId]) => ({
          id: parseInt(questionId),
          answer_ids: [answerId]
        }))
      });
      console.log('Quiz submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };
  </script>
  
  <style scoped>
  img {
    display: block;
    margin: 0 auto;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    margin-bottom: 0.5rem;
  }
  label {
    display: flex;
    align-items: center;
  }
  input[type="radio"] {
    margin-right: 0.5rem;
  }
  button {
    cursor: pointer;
  }
  </style>
  