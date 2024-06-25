import { defineEventHandler } from 'h3'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'
import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

const iiifBaseUrl = 'https://www.artic.edu/iiif/2';
const baseUrl = 'https://api.artic.edu/api/v1/artworks/search';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  const query = getQuery(event);
  const questionType = query.type;
  let numOfQuestions = 10;
  if (query.limit) {
    numOfQuestions = query.limit;
  }

  const questions = await createMCQs(numOfQuestions);

  const quiz = await saveQuiz(client, user.id, questions);

  const quizId = quiz[0].id;

  const quizItems = db.fetchQuizItems(client, quizId);

  return quizItems;
  
});

// Methode zum Abrufen der Kunstwerk-Daten
const createMCQs = async (numOfQuestions) => {

  let selectedArtworks = [];

  try {
    const params = {
      q:'Impressionism',
      fields:'id,title,artist_title,date_display,image_id,style_title,style_titles',
      limit:100,
    }
    const response = await axios.get(baseUrl, { params });
    if (response.status === 200 && response.data.data.length > 0) {
      const artworks = response.data.data;
      selectedArtworks = getRandomArtworks(artworks, numOfQuestions);
    }

    // Umwandlung der Kunstwerk-Daten in Quiz-Fragen
    const questions = selectedArtworks.map(artwork => {
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
        image_url: `${iiifBaseUrl}/${artwork.image_id}/full/843,/0/default.jpg`
        }
      };
    });

    return questions;

  } catch (error) {
    console.error('Fehler beim Abrufen der Fragen:', error);
  }
};

const getRandomArtworks = (artworks, amount) => {
  const randomArtworks = [];
  const totalArtworks = artworks.length;

  // Generate random indices
  const randomIndices = [];
  while (randomIndices.length < amount) {
    const randomIndex = Math.floor(Math.random() * totalArtworks);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }

  // Get random artworks
  randomIndices.forEach(index => {
    randomArtworks.push(artworks[index]);
  });

  return randomArtworks;
};

const createAnswers = (artworks, amount, fieldName, correctAnswer) => {
  const answers = [];
  const uniqueValues = new Set();

  while (answers.length < amount-1) {
    const randomArtwork = artworks[Math.floor(Math.random() * artworks.length)];
    const fieldValue = randomArtwork[fieldName];

    if (!uniqueValues.has(fieldValue)) {
      const answer = {
        id: uuidv4(),
        value: fieldValue
      };
      answers.push(answer);
      uniqueValues.add(fieldValue);
    }
  }

  // Add the correct answer at a random position
  const randomPosition = Math.floor(Math.random() * (amount + 1));
  answers.splice(randomPosition, 0, correctAnswer);

  return answers;
};

const saveQuiz = async (client, userId, questions) => {

  const { data: quiz, error: quizError } = await client
    .from('quizzes')
    .insert([
        { score: 0.0, owner: userId },
    ])
    .select();

  if (quizError) {
    return error;
  } 

  const quizId = quiz[0].id;

  const quizItems = questions.map(question => ({
    type: question.type,
    quiz_id: quizId,
    content: question.content,
  }));

  const {data: items, error: itemError} = await client
    .from('quiz_items')
    .insert(quizItems);

  if (itemError) {
    return itemError;
  } else return quiz;

}
