import { v4 as uuidv4 } from 'uuid';
import helpers from './helpers';

const iiifBaseUrl = 'https://www.artic.edu/iiif/2';

const createFindTheWrongPictureQuestions = async (epochArtworks, otherEpochArtworks, epoch, numOfQuestions) => {
  try {
    const questions = [];

    if (epochArtworks.length < 4) {
      throw new Error('Nicht genug Kunstwerke in der angegebenen Epoche gefunden.');
    }

    if (numOfQuestions == undefined) {
      numOfQuestions = 2;
    }

    for (let i = 0; i < numOfQuestions; i++) {

      // Find one artwork from a different epoch
      const wrongArtwork = helpers.getRandomItems(otherEpochArtworks, 1)[0];
      // Create the correct answer option
      const correctAnswer = {
        id: uuidv4(),
        value: `${iiifBaseUrl}/${wrongArtwork.image_id}/full/843,/0/default.jpg`,
      };

      questions.push({
        type: 'find_the_wrong_picture',
        content: {
          stem: `Find the picture that does not belong to the epoch "${epoch}"!`,
          answers_options: createAnswers(epochArtworks, 4, correctAnswer, epoch),
          correct_answers: [correctAnswer],
        }
      });
      
    }

    return questions;

  } catch (error) {
    console.error('Fehler beim Erstellen der Frage:', error);
  }
};

const createFindTheCorrectPictureQuestions = async (epochArtworks, otherEpochArtworks, epoch, numOfQuestions) => {
  try {
    const questions = [];

    if (epochArtworks.length < 4) {
      throw new Error('Nicht genug Kunstwerke in der angegebenen Epoche gefunden.');
    }

    if (numOfQuestions == undefined) {
      numOfQuestions = 2;
    }

    for (let i = 0; i < numOfQuestions; i++) {

      // Find one artwork from a different epoch
      const correctArtwork = helpers.getRandomItems(epochArtworks, 1)[0];
      // Create the correct answer option
      const correctAnswer = {
        id: uuidv4(),
        value: `${iiifBaseUrl}/${correctArtwork.image_id}/full/843,/0/default.jpg`,
        /* style_title: correctArtwork.style_title, */
      };

      questions.push({
        type: 'find_the_correct_picture',
        content: {
          stem: `Find the picture which belongs to the epoch "${epoch}"!`,
          answers_options: createAnswers(otherEpochArtworks, 4, correctAnswer, epoch),
          correct_answers: [correctAnswer],
        }
      });
      
    }

    return questions;
    
  } catch (error) {
    console.error('Fehler beim Erstellen der Frage:', error);
  }
};



// Create Answers for the Questions with random distractors
const createAnswers = (distractors, amount, correctAnswer, correctAnswerAttribute) => {
    const answers = [];
    const uniqueValues = new Set();
    answers.push(correctAnswer);
    uniqueValues.add(correctAnswer.value);
    while (answers.length < amount) {
      const randomArtwork = distractors[Math.floor(Math.random() * distractors.length)];
      const imageId = randomArtwork.image_id;
      const styleTitle = randomArtwork.style_title;
      if (correctAnswerAttribute && Object.values(randomArtwork).includes(correctAnswerAttribute)) {
        continue;
      }
      if (uniqueValues.has(imageId)) {
        continue;
      }
        const answer = {
          id: uuidv4(),
          value: `${iiifBaseUrl}/${imageId}/full/843,/0/default.jpg`,
          /* style_title: styleTitle, */
        };
        answers.push(answer);
        uniqueValues.add(imageId);
    }

    // Shuffle the answers so the correct answer is not always at first position
    const shuffledAnswers = helpers.shuffleArray(answers);
    return shuffledAnswers;
};

export default {
  createFindTheWrongPictureQuestions,
  createFindTheCorrectPictureQuestions,
};