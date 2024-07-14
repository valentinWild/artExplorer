import { defineEventHandler } from 'h3'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'
import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'
import findThePicture from '../utils/findThePicture';
import textQuestion from '../utils/textQuestion';
import timelineQuiz from '../utils/timelineQuiz'; 
import mcq from '../utils/mcq';
import db from "../utils/db";
import helpers from "../utils/helpers";

const iiifBaseUrl = 'https://www.artic.edu/iiif/2';
const baseUrl = 'https://api.artic.edu/api/v1/artworks/search';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  const query = getQuery(event);
  const questionType = query.type;
  let numOfQuestions = 12;
  let styleCategory = 'Impressionism';
  if (query.limit) {
      numOfQuestions = query.limit;
  }
  if (query.style_category) {
      styleCategory = query.style_category.toString();
  }
  console.log('Create Quiz for Category', styleCategory);

  const numOfMCQs = Math.floor(numOfQuestions / 3);
  const numOfTextQuestions = numOfMCQs;
  const numOfWrongPictureQuestions = Math.floor((numOfQuestions - numOfMCQs - numOfTextQuestions) / 2);
  const numOfCorrectPictureQuestions = numOfQuestions - numOfMCQs - numOfTextQuestions - numOfWrongPictureQuestions;
  const numOfTimelineQuestions = Math.floor(numOfQuestions / 4);

  const epochArtworks = await fetchExternalArtworks(numOfQuestions, styleCategory);
  const otherEpochArtworks = await fetchExternalArtworks(numOfQuestions, '');
  console.log('Fetched external Artworks');

  const findWrongPictureQuestions = await findThePicture.createFindTheWrongPictureQuestions(epochArtworks, otherEpochArtworks, styleCategory, numOfWrongPictureQuestions);
  console.log('Created findWrongPictureQuestions');
  const findCorrectPictureQuestions = await findThePicture.createFindTheCorrectPictureQuestions(epochArtworks, otherEpochArtworks, styleCategory, numOfCorrectPictureQuestions);
  console.log('Created findCorrectPictureQuestions');
  const mcqs = await mcq.createMCQuestions(numOfMCQs, epochArtworks, styleCategory);
  console.log('Created MCQs');
  const textQuestions = await textQuestion.createTextQuestions(styleCategory, numOfTextQuestions);
  console.log('Created text questions');
  const timelineQuestions = await timelineQuiz.createTimelineQuestions(styleCategory, numOfTimelineQuestions);
  console.log('Created timeline questions');
  
  const questions = [...mcqs, ...findWrongPictureQuestions, ...findCorrectPictureQuestions, ...textQuestions, ...timelineQuestions];
  console.log('Created questions');

  const quiz = await saveQuiz(client, user.id, questions, styleCategory);
  const quizId = quiz[0].id;
  const quizItems = await db.fetchQuizItems(client, quizId);

  // Remove the correct answers (so they are not exposed to frontend)
  const userQuizItems = quizItems.map(item => {
      const { content, ...rest } = item;
      if (content.correct_answers) {
          delete content.correct_answers;
      }
      if (content.correct_order) {
          delete content.correct_order;
      }
      return { ...rest, content };
  });

  return helpers.shuffleArray(userQuizItems);
});

const fetchExternalArtworks = async (numOfQuestions, styleCategory) => {
  try {
      const params = {
          q: styleCategory,
          fields: 'id,title,artist_title,date_display,image_id,style_title,style_titles',
          limit: numOfQuestions * 10,
      }
      // Fetch Artworks Data from external API
      const response = await axios.get(baseUrl, { params });
      if (response.status === 200 && response.data.data.length > 0) {
          const artworks = response.data.data;
          const filteredArtworks = removeUndefinedArtworks(artworks);
          return filteredArtworks;
      } else {
          throw new Error('Could not fetch artworks from external API.')
      }
  } catch (error) {
      console.error(error);
  }
}

const removeUndefinedArtworks = (artworks) => {
  return artworks.filter(artwork => {
      const { id, title, artist_title, date_display, image_id, style_title } = artwork;
      return image_id !== null && title !== null && artist_title !== null && date_display !== null && image_id !== null && style_title !== null;
  });
}

const createTimelineQuestions = async (artworks, styleCategory, numOfQuestions) => {
  const questions = [];
  for (let i = 0; i < numOfQuestions; i++) {
      const selectedArtworks = helpers.getRandomItems(artworks, 4);
      const correctOrder = selectedArtworks.slice().sort((a, b) => {
          const yearA = parseInt(a.date_display.match(/\d{4}/));
          const yearB = parseInt(b.date_display.match(/\d{4}/));
          return yearA - yearB;
      });
      questions.push({
          type: 'timeline',
          content: {
              artworks: selectedArtworks,
              correct_order: correctOrder.map(artwork => ({ id: artwork.id }))
          }
      });
  }
  return questions;
}

// Save the whole Quiz in Database
const saveQuiz = async (client, userId, questions, styleCategory) => {
  // Insert a new Quiz to the Database
  const quiz = await db.insertQuiz(client, userId, styleCategory);

  const quizId = quiz[0].id;

  const quizItems = questions.map(question => ({
      type: question.type,
      quiz_id: quizId,
      content: question.content,
  }));

  // Insert all QuizItems to the Database
  const items = await db.insertQuizItems(client, quizItems);

  return quiz;
}
