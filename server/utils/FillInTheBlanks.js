import axios from 'axios';
import helpers from './helpers';

const WIKI_API_URL = 'https://en.wikipedia.org/w/api.php';

export const fetchWikiText = async () => {
  try {
    const params = {
      action: 'query',
      prop: 'extracts',
      exintro: true,
      titles: 'Impressionism',
      format: 'json',
      origin: '*',
    };

    const response = await axios.get(WIKI_API_URL, { params });

    if (response.status === 200 && response.data.query) {
      const pages = response.data.query.pages;
      const page = Object.values(pages)[0];
      return page.extract || 'No extract available';
    } else {
      return 'Error fetching data';
    }
  } catch (error) {
    console.error('Error fetching data from Wikipedia API:', error);
    return 'Error fetching data';
  }
};

const createFillInTheBlanksQuestions = async (styleCategory, numOfQuestions) => {
  const questions = [];
  for (let i = 0; i < numOfQuestions; i++) {
    const text = await fetchTextFromExternalSource(styleCategory);
    const { formattedText, correctAnswers } = createBlanksFromText(text);
    questions.push({
      type: 'fill_in_the_blanks',
      content: {
        text: formattedText,
        correct_answers: correctAnswers,
      }
    });
  }
  return questions;
};

const fetchTextFromExternalSource = async (styleCategory) => {
  const text = await fetchWikiText();
  return text;
};

const createBlanksFromText = (text) => {
  const sentences = text.split('. ');
  const validSentences = sentences.filter(sentence => sentence.split(' ').some(word => word.length > 3));
  const randomIndex = Math.floor(Math.random() * validSentences.length);
  const sentence = validSentences[randomIndex];

  const words = sentence.split(' ');
  const blankIndices = helpers.getRandomIndices(words, 3, 3); // Maximum 3 blanks

  const correctAnswers = [];
  blankIndices.forEach((index, blankIndex) => {
    correctAnswers.push(words[index]);
    words[index] = `__blank_${blankIndex}__`;
  });

  const formattedText = words.join(' ') + '.';
  return { formattedText, correctAnswers };
};

export default {
  createFillInTheBlanksQuestions,
};
