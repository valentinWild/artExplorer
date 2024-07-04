import { v4 as uuidv4 } from 'uuid';
import helpers from './helpers';

const iiifBaseUrl = 'https://www.artic.edu/iiif/2';

const createFindTheWrongPictureQuestions = async (artworks, epoch, numOfQuestions = 2) => {
  try {
    const questions = [];

    for (let i = 0; i < numOfQuestions; i++) {
      // Filter artworks by the given epoch
      const artworksInEpoch = artworks.filter(artwork => artwork.style_title === epoch);

      if (artworksInEpoch.length < 4) {
        throw new Error('Nicht genug Kunstwerke in der angegebenen Epoche gefunden.');
      }

      // Randomly select 4 artworks from the given epoch
      const selectedArtworks = helpers.getRandomItems(artworksInEpoch, 4);

      // Find one artwork from a different epoch
      const artworksNotInEpoch = artworks.filter(artwork => artwork.style_title !== epoch);
      const wrongArtwork = helpers.getRandomItems(artworksNotInEpoch, 1)[0];

      // Combine artworks
      const questionArtworks = [...selectedArtworks, wrongArtwork];

      // Shuffle the artworks to randomize the position of the wrong artwork
      const shuffledArtworks = helpers.shuffleArray(questionArtworks);

           // Add correct answer
           const correctAnswer = {
            id: uuidv4(),
            value: wrongArtwork.image_url
          };
    

          questions.push({
            type: 'find_the_wrong_picture',
            content: {
              stem: `Find the picture that does not belong to the epoch"${epoch}" gehört.`,
              artworks: shuffledArtworks.map(artwork => ({
                id: uuidv4(),
                image_url: `${iiifBaseUrl}/${artwork.image_id}/full/843,/0/default.jpg`,
                style_title: artwork.style_title
              })),
              correct_answers: [correctAnswer]
            }
          });
        }

    return questions;
  } catch (error) {
    console.error('Fehler beim Erstellen der Frage:', error);
  }
};

export default {
  createFindTheWrongPictureQuestions,
};