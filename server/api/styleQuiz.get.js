import { defineEventHandler } from 'h3'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'
import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'
import mcq from '../utils/mcq';

const iiifBaseUrl = 'https://www.artic.edu/iiif/2';
const baseUrl = 'https://api.artic.edu/api/v1/artworks/search';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  const query = getQuery(event);
  const questionType = query.type;
  let numOfQuestions = 10;
  let styleCategory = 'Impressionism';
  if (query.limit) {
    numOfQuestions = query.limit;
  }
  if (query.style_category) {
    styleCategory = query.style_category.toString();
  }
  console.log('Create Quiz for Category',styleCategory);

  const artworks = await fetchExternalArtworks(numOfQuestions, styleCategory);
  const questions = await mcq.createQuestions(numOfQuestions, artworks);
  const quiz = await saveQuiz(client, user.id, questions, styleCategory);
  const quizId = quiz[0].id;
  const quizItems = await db.fetchQuizItems(client, quizId);

  // Remove the correct answers (so they are not exposed to frontend)
  const userQuizItems = quizItems.map(item => {
    const { content, ...rest } = item;
    delete content.correct_answers;
    return { ...rest, content };
  });

  return userQuizItems;
  return quizItems;
  
});


const fetchExternalArtworks = async(numOfQuestions, styleCategory) => {
  try {
    const params = {
      q:styleCategory,
      fields:'id,title,artist_title,date_display,image_id,style_title,style_titles',
      limit:numOfQuestions * 10,
    }
    // Fetch Artworks Data from external API
    const response = await axios.get(baseUrl, { params });
    if (response.status === 200 && response.data.data.length > 0) {
      const artworks = response.data.data;
      return artworks;
    }
    else {
      throw new Error('Could not fetch artworks from external API.')
    }
  } catch (error) {
    console.error(error);
  }
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