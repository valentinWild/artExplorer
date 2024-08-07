import { v4 as uuidv4 } from 'uuid'
import helpers from './helpers';

const iiifBaseUrl = 'https://www.artic.edu/iiif/2';

const createMCQuestions = async (numOfQuestions, artworks, epoch) => {
  try {
      let selectedArtworks = helpers.getRandomItems(artworks, numOfQuestions*2);
      let questions = [];

      // Erstellt verschiedene MCQ-Fragen
      for (let i = 0; i < numOfQuestions; i++) {
          if (i % 3 === 0) {
              questions.push(createMCQType1(selectedArtworks[i], selectedArtworks));
          } else if (i % 3 === 1) {
              questions.push(createMCQType2(selectedArtworks[i], selectedArtworks));
          } else {
              questions.push(createMCQType3(selectedArtworks[i], selectedArtworks));
          }
      }
 
      return questions;
  
    } catch (error) {
      console.error('Fehler beim Abrufen der Fragen:', error);
    }
  
  };
  
  const createMCQType1 = (artwork, selectedArtworks) => {
    console.log('create mcq type 1');
    const correctAnswerId = uuidv4();
    return {
      type: 'mcq',
      content: {
        stem: `Which of these artworks is made by the artist ${artwork.artist_title}?`,
        correct_answers: [{
          id: correctAnswerId,
          value: artwork.title || 'Titel unbekannt'
        }],
        answers_options: createAnswers(selectedArtworks, 4, 'title', {id:correctAnswerId, value: artwork.title || 'Titel unbekannt'}, artwork.artist_title),
      }
    };
  }
  
  const createMCQType2 = (artwork, selectedArtworks) => {
    console.log('create mcq type 2');
    const correctAnswerId = uuidv4();
    return {
      type: 'mcq',
      content: {
        stem: `Which title has this artwork by ${artwork.artist_title}?`,
        correct_answers: [{
          id: correctAnswerId,
          value: artwork.title || 'Titel unbekannt'
        }],
        answers_options: createAnswers(selectedArtworks, 4, 'title', {id:correctAnswerId, value: artwork.title || 'Titel unbekannt'}),
        image_url: `${iiifBaseUrl}/${artwork.image_id}/full/843,/0/default.jpg`,
        }
    };
  }
  
  const createMCQType3 = (artwork, selectedArtworks) => {
    console.log('create mcq type 3');
    const correctAnswerId = uuidv4();
    return {
      type: 'mcq',
      content: {
        stem: `Who created the artwork named "${artwork.title}"?`,
        correct_answers: [{
          id: correctAnswerId,
          value: artwork.artist_title || 'Künstler unbekannt'
        }],
        answers_options: createAnswers(selectedArtworks, 4, 'artist_title', {id:correctAnswerId, value: artwork.artist_title || 'Künstler unbekannt'}),
        image_url: `${iiifBaseUrl}/${artwork.image_id}/full/843,/0/default.jpg`,
        }
    };
  }


  // Create Answers for the Questions with random distractors
const createAnswers = (artworks, amount, fieldName, correctAnswer, correctAnswerAttribute) => {
    const answers = [];
    const uniqueValues = new Set();
    answers.push(correctAnswer);
    uniqueValues.add(correctAnswer.value);
    while (answers.length < amount) {
      const randomArtwork = artworks[Math.floor(Math.random() * artworks.length)];
      const fieldValue = randomArtwork[fieldName];
      if (correctAnswerAttribute && Object.values(randomArtwork).includes(correctAnswerAttribute)) {
        continue;
      }
      if (uniqueValues.has(fieldValue)) {
        continue;
      }
        const answer = {
          id: uuidv4(),
          value: fieldValue
        };
        answers.push(answer);
        uniqueValues.add(fieldValue);
    }
  
    // Shuffle the answers so the correct answer is not always at first position
    const shuffledAnswers = helpers.shuffleArray(answers);
    return shuffledAnswers;
};



export default {
    createMCQuestions,
};