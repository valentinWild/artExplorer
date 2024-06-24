<template>
    <div class="quiz-container">
      <h1>Kunstgeschichte Quiz</h1>
      <div v-if="loading">Lädt...</div>
      <div v-else>
        <div v-for="(question, index) in questions" :key="index" class="question">
          <h2>{{ question.title }}</h2>
          <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex">
            <label>
              <input type="radio" :name="'question' + index" :value="answer" v-model="userAnswers[index]">
              {{ answer }}
            </label>
          </div>
        </div>
        <button @click="submitQuiz">Quiz abschließen</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  // Zustand der Komponente initialisieren
  const questions = ref([]);
  const userAnswers = ref([]);
  const loading = ref(true);
  const impressionistArtists = ref(new Set());
  
  // Zufällige Antworten generieren
  const generateRandomAnswers = (correctAnswer, artistSet) => {
    const allArtists = Array.from(artistSet);
    const allAnswers = [correctAnswer];
    const usedAnswers = new Set(allAnswers);
  
    while (allAnswers.length < 4) {
      const randomArtist = allArtists[Math.floor(Math.random() * allArtists.length)];
      if (!usedAnswers.has(randomArtist)) {
        allAnswers.push(randomArtist);
        usedAnswers.add(randomArtist);
      }
    }
  
    return allAnswers.sort(() => Math.random() - 0.5);
  };
  
  // Methode zum Abrufen der Kunstwerk-Daten
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('https://api.artic.edu/api/v1/artworks?page=1&limit=100');
      const artworks = response.data.data;
  
      // Filtere unbetitelte Kunstwerke und solche ohne artist_title oder style_title heraus
      const filteredArtworks = artworks.filter(artwork => artwork.title && artwork.artist_title && artwork.style_title === "Impressionism");
  
      // Impressionismus-Künstler sammeln
      filteredArtworks.forEach(artwork => {
        impressionistArtists.value.add(artwork.artist_title);
      });
  
      // Umwandlung der Kunstwerk-Daten in Quiz-Fragen
      questions.value = filteredArtworks.map(artwork => ({
        title: `Wer hat das Kunstwerk "${artwork.title}" geschaffen?`,
        answers: generateRandomAnswers(artwork.artist_title || 'Künstler unbekannt', impressionistArtists.value)
      }));
  
      userAnswers.value = new Array(questions.value.length).fill(null);
      loading.value = false;
    } catch (error) {
      console.error('Fehler beim Abrufen der Fragen:', error);
    }
  };
  
  // Quiz abschließen
  const submitQuiz = () => {
    console.log('Benutzerantworten:', userAnswers.value);
  };
  
  // Daten abrufen, wenn die Komponente gemountet wird
  onMounted(fetchQuestions);
  </script>
  
  <style scoped>
  .quiz-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  
  .question {
    margin-bottom: 20px;
  }
  </style>
  