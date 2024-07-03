import { v4 as uuidv4 } from 'uuid'
import helpers from './helpers';

const iiifBaseUrl = 'https://www.artic.edu/iiif/2';

const createQuestions = async (numOfQuestions, artworks) => {

    let selectedArtworks = [];
  
    try {
  
      selectedArtworks = helpers.getRandomItems(artworks, numOfQuestions);
  
      let questions = []
      let i = 0;
      while(i < numOfQuestions) {
        questions.push(createMCQType1(selectedArtworks[i], selectedArtworks));
        i++;
        if (i >= numOfQuestions) {
          break;
        }
        questions.push(createMCQType2(selectedArtworks[i], selectedArtworks));
        i++;
        if (i >= numOfQuestions) {
          break;
        }
        questions.push(createMCQType3(selectedArtworks[i], selectedArtworks));
        i++;
      }
      return questions;
  
    } catch (error) {
      console.error('Fehler beim Abrufen der Fragen:', error);
    }
  
  };
  
  const createMCQType1 = (artwork, selectedArtworks) => {
    const correctAnswerId = uuidv4();
    return {
      type: 'mcq',
      content: {
        stem: `Welches dieser Kunstwerke stammt von ${artwork.artist_title}?`,
        correct_answers: [{
          id: correctAnswerId,
          value: artwork.title || 'Titel unbekannt'
        }],
        answers_options: createAnswers(selectedArtworks, 4, 'title', {id:correctAnswerId, value: artwork.title || 'Titel unbekannt'}, artwork.artist_title),
      }
    };
  }
  
  const createMCQType2 = (artwork, selectedArtworks) => {
    const correctAnswerId = uuidv4();
    return {
      type: 'mcq',
      content: {
        stem: `Welchen Titel trägt dieses Kunstwerk von ${artwork.artist_title}?`,
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
    const correctAnswerId = uuidv4();
    return {
      type: 'mcq',
      content: {
        stem: `Wer hat das Kunstwerk "${artwork.title}" geschaffen?`,
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
    createQuestions,
};