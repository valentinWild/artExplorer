import { v4 as uuidv4 } from 'uuid';
import helpers from './helpers';

const iiifBaseUrl = 'https://www.artic.edu/iiif/2';

const createFindTheWrongPictureQuestions = async (epochArtworks, otherEpochArtworks, epoch, numOfQuestions = 2) => {
  try {
    const questions = [];

    for (let i = 0; i < numOfQuestions; i++) {
      // Filter artworks by the given epoch
      /* const artworksInEpoch = artworks.filter(artwork => artwork.style_title === epoch); */

      /* if (artworksInEpoch.length < 4) {
        throw new Error('Nicht genug Kunstwerke in der angegebenen Epoche gefunden.');
      } */

      // Randomly select 4 artworks from the given epoch
      const selectedArtworks = helpers.getRandomItems(epochArtworks, 4);

      // Find one artwork from a different epoch
      //const artworksNotInEpoch = artworks.filter(artwork => artwork.style_title !== epoch);
      const wrongArtwork = helpers.getRandomItems(otherEpochArtworks, 1)[0];

      // Combine artworks
      //const questionArtworks = [...selectedArtworks, wrongArtwork];

      // Shuffle the artworks to randomize the position of the wrong artwork
/*       const shuffledArtworks = helpers.shuffleArray(questionArtworks); */

      // Add correct answer
      const correctAnswer = {
        id: uuidv4(),
        value: `${iiifBaseUrl}/${wrongArtwork.image_id}/full/843,/0/default.jpg`,
      };


          questions.push({
            type: 'find_the_wrong_picture',
            content: {
              stem: `Find the picture that does not belong to the epoch"${epoch}"!`,
/*               artworks: shuffledArtworks.map(artwork => ({
                id: uuidv4(),
                image_url: `${iiifBaseUrl}/${artwork.image_id}/full/843,/0/default.jpg`,
                style_title: artwork.style_title
              })), */
              answers_options: createAnswers(epochArtworks, 4, correctAnswer, 'style_title'),
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
    /* console.log(distractors); */
    const answers = [];
    const uniqueValues = new Set();
    answers.push(correctAnswer);
    uniqueValues.add(correctAnswer.value);
    while (answers.length < amount) {
      const randomArtwork = distractors[Math.floor(Math.random() * distractors.length)];
      console.log(randomArtwork);
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
};