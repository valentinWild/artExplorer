import db from "../utils/db";
import { serverSupabaseClient } from '#supabase/server';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);
  
    try {
        const body = await readBody(event);
        if (!body.quiz_id) {
            throw new Error("Invalid quiz data. Quiz ID is required.");
        }

        const quizId = body.quiz_id;
        // Get the quiz items results for this Quiz from Database
        const quizItems = await db.fetchQuizItemsResults(client, quizId);
        // Sum um the items points and calculate the score
        console.log(quizItems);
        const score = calculateScore(quizItems);
        const totalPoints = calculateTotalPoints(quizItems);
        const userResult = {
            'totalPoints': totalPoints,
            'score': score,
        }
        // Save User's Score and the Date and Time when quiz is finished to Database
        const updatedQuiz = await db.updateQuiz(client, body.quiz_id, {'finished': new Date().toISOString(), 'score': score});
        console.log(updatedQuiz);
        return userResult;
    } catch (error) {
        return error;
    }
});


const calculateScore = (quizItems) => {
    let totalPoints = 0;
    quizItems.forEach((item) => {
        totalPoints += item.points;
    });
    const score = totalPoints / quizItems.length;
    return score;
};

const calculateTotalPoints = (quizItems) => {
    let totalPoints = 0;
    quizItems.forEach((item) => {
        totalPoints += item.points;
    });
    return totalPoints;
};

const exampleSolution = {
    quiz_id: 28,
    items: [
        {
            id: 21,
            type: "mcq",
            quiz_id: 28,
            answer_ids: ["48989152-64e1-4728-950d-5561e1addbd5"],
        },
        {
            id: 22,
            type: "mcq",
            quiz_id: 28,
            answer_ids: ["59e08ae8-24e2-4cf9-b632-1b34bcf8a92b"],
        }
    ],
}