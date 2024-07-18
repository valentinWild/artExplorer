import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import helpers from './helpers';

const iiifBaseUrl = 'https://www.artic.edu/iiif/2';
const baseUrl = 'https://api.artic.edu/api/v1/artworks/search';

const createTimelineQuestions = async (styleCategory, numOfQuestions) => {
  const epochArtworks = await fetchExternalArtworks(numOfQuestions, styleCategory);

  if (epochArtworks.length < 4) {
    throw new Error('Nicht genug Kunstwerke in der angegebenen Epoche gefunden.');
  }

  const questions = [];
  
  for (let i = 0; i < numOfQuestions; i++) {
    const selectedArtworks = helpers.getRandomItems(epochArtworks, 4);
    const correctOrder = selectedArtworks.map(artwork => ({
      date_display: artwork.date_display.match(/\d{4}/)[0],
      id: artwork.id
    })).sort((a, b) => a.date_display - b.date_display);

    const content = {
      images: selectedArtworks.map(artwork => ({
        id: uuidv4(),
        src: `${iiifBaseUrl}/${artwork.image_id}/full/843,/0/default.jpg`,
        title: artwork.title,
        artist_title: artwork.artist_title,
        date_display: artwork.date_display
      })),
      correct_order: correctOrder.map(order => order.date_display)
    };

    questions.push({
      type: 'timeline_quiz',
      content: content
    });
  }

  return questions;
};

const fetchExternalArtworks = async (numOfQuestions, styleCategory) => {
  try {
    const params = {
      q: styleCategory,
      fields: 'id,title,artist_title,date_display,image_id,style_title,style_titles',
      limit: numOfQuestions * 10,
    };
    const response = await axios.get(baseUrl, { params });
    if (response.status === 200 && response.data.data.length > 0) {
      const artworks = response.data.data;
      const filteredArtworks = removeUndefinedArtworks(artworks);
      return filteredArtworks;
    } else {
      throw new Error('Could not fetch artworks from external API.');
    }
  } catch (error) {
    console.error(error);
  }
};

const removeUndefinedArtworks = (artworks) => {
  return artworks.filter(artwork => {
    const { id, title, artist_title, date_display, image_id, style_title } = artwork;
    return image_id !== null && title !== null && artist_title !== null && date_display !== null && image_id !== null && style_title !== null;
  });
};

export default {
  createTimelineQuestions
};
