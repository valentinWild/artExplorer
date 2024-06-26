import db from "../utils/db";
import { serverSupabaseClient } from '#supabase/server';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);
  
    try {
        const body = await readBody(event);
        if (!body.quiz_id || !body.item) {
            throw new Error("Invalid quiz data. Quiz ID and item is required.");
        }

        const userSolution = body.item;
        // Get the full Quiz Items (with solutions) for this Quiz from Database
        const itemsArray = await db.fetchSingleQuizItem(client, body.item.id);
        const quizItem = itemsArray[0];
        // Get the checked QuizItems, were the solution is compared to the user's answer
        const result = await checkQuizItem(quizItem, userSolution);
        // Save the User's results for each quiz item to Database
        const updatedQuizItem = await db.updateSingleQuizItem(client, quizItem.id, result); 

        return updatedQuizItem;

    } catch (error) {
        return error;
    }
    
});

// Check single quizItem (if solved correctly) -> return the quizItem with updated points and userAnswerIds
const checkQuizItem = async(quizItem, userSolutions) => {

    const correctAnswerIds = quizItem.content.correct_answers.map(answer => answer.id);
    let userAnswerIds = [];
    if (userSolutions) {
        userAnswerIds = userSolutions.answer_ids;
    }
    let itemScore = 0;
    console.log(userSolutions);
    const valuesEqual = correctAnswerIds.every(answerId => userAnswerIds.includes(answerId));
    quizItem.user_answers = userAnswerIds;
    quizItem.answered = true;
    if (valuesEqual) {
        itemScore = 1.0
    } else {
        itemScore = 0.0
    }
    quizItem.points = itemScore;

    return quizItem;
}


const exampleSolution = {
    quiz_id: 28,
    item: 
        {
            id: 21,
            type: "mcq",
            quiz_id: 28,
            answer_ids: ["48989152-64e1-4728-950d-5561e1addbd5"],
        }
}