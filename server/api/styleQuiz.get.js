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

// Create Quiz-Items from External API (api.artic.edu)
const createMCQs = async (numOfQuestions) => {

  let selectedArtworks = [];

  try {

    const params = {
      q:'Impressionism',
      fields:'id,title,artist_title,date_display,image_id,style_title,style_titles',
      limit:100,
    }
  
    // Fetch Artworks Data from external API
    const response = await axios.get(baseUrl, { params });
    if (response.status === 200 && response.data.data.length > 0) {
      const artworks = response.data.data;
      // Get random artworks (depending on num of Questions) out of the 100 fetched ones
      selectedArtworks = getRandomArtworks(artworks, numOfQuestions);
    }

    // Create Questions from Artworks-Data
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

// Create Answers for the Questions with random distractors
const createAnswers = (artworks, amount, fieldName, correctAnswer) => {
  const answers = [];
  const uniqueValues = new Set();
  answers.push(correctAnswer);
  uniqueValues.add(correctAnswer.value);

  while (answers.length < amount) {
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

  // Shuffle the answers so the correct answer is not always at first position
  const shuffledAnswers = shuffleArray(answers);
  return shuffledAnswers;

};


// Save the whole Quiz in Database
const saveQuiz = async (client, userId, questions) => {

  // Insert a new Quiz to the Database
  const quiz = await db.instertQuiz(client, userId);

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

// Function to shuffle an array
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
