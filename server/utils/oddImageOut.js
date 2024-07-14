import { v4 as uuidv4 } from 'uuid';
import helpers from './helpers';

const iiifBaseUrl = 'https://www.artic.edu/iiif/2';

const createOddImageOutQuestion = async (styleCategory, client) => {
  // Fetch 4 artworks from the given style
  const response1 = await client
    .from('artworks')
    .select('id,title,artist_title,date_display,image_id,style_title')
    .eq('style_title', styleCategory)
    .limit(4);

  if (response1.error) {
    throw response1.error;
  }

  const artworksStyle = response1.data;

  // Fetch 1 artwork from a different style
  const response2 = await client
    .from('artworks')
    .select('id,title,artist_title,date_display,image_id,style_title')
    .neq('style_title', styleCategory)
    .limit(1);

  if (response2.error) {
    throw response2.error;
  }

  const artworkDifferentStyle = response2.data[0];

  const allArtworks = [...artworksStyle, artworkDifferentStyle];

  // Shuffle the artworks array so the odd one is in a random position
  const shuffledArtworks = helpers.shuffleArray(allArtworks);

  const correctAnswerId = artworkDifferentStyle.id;

  return {
    type: 'odd_image_out',
    content: {
      stem: `Welches dieser Kunstwerke gehört nicht zur Epoche ${styleCategory}?`,
      correct_answers: [{
        id: correctAnswerId,
        value: artworkDifferentStyle.title || 'Titel unbekannt'
      }],
      answers_options: shuffledArtworks.map(artwork => ({
        id: artwork.id,
        value: artwork.title || 'Titel unbekannt',
        image_url: `${iiifBaseUrl}/${artwork.image_id}/full/843,/0/default.jpg`,
      })),
    }
  };
};

export default {
  createOddImageOutQuestion,
};