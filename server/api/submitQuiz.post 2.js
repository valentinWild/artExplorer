import db from "../utils/db";
import { serverSupabaseClient } from '#supabase/server';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);
  
    try {
        const body = await readBody(event);
        if (!body.quiz_id || !body.items) {
            throw new Error("Invalid quiz data. Quiz ID and items are required.");
        }

        const userSolutions = body.items;
        // Get the full Quiz Items (with solutions) for this Quiz from Database
        const quizItems = await db.fetchQuizItems(client, body.quiz_id);
        // Get the checked QuizItems, were the solution is compared to the user's answer
        const result = await checkQuizItems(quizItems, userSolutions);
        // Save the User's results for each quiz item to Database
        const updatedQuizItems = await db.updateQuizItems(client, result); 
        const totalPoints = calculateTotalPoints(updatedQuizItems);
        const userResult = {
            'totalPoints': totalPoints,
            'score': totalPoints/updatedQuizItems.length,
        }
        // Save User's Score and the Date and Time when quiz is finished to Database
        const updatedQuiz = await db.updateQuiz(client, body.quiz_id, {'finished': new Date().toISOString(), 'score': totalPoints/updatedQuizItems.length});
        console.log(updatedQuiz);
        return userResult;

    } catch (error) {
        return error;
    }
    
});

// Check which quiz items are correctly solved, return the quizItems with updated points and userAnswerIds
const checkQuizItems = async(quizItems, userSolutions) => {
    quizItems.forEach(item => {
        const correctAnswerIds = item.content.correct_answers.map(answer => answer.id);
        const userSolution = userSolutions.find(solution => solution.id === item.id);
        let userAnswerIds = [];
        if (userSolution) {
            userAnswerIds = userSolution.answer_ids;
        }
        let itemScore = 0;
        const valuesEqual = correctAnswerIds.every(answerId => userAnswerIds.includes(answerId));
        item.user_answers = userAnswerIds;
        item.answered = true;
        if (valuesEqual) {
            itemScore = 1.0
        } else {
            itemScore = 0.0
        }
        item.points = itemScore;
    });
    return quizItems;
}

// Caluate the Total Points of all Quiz Items
const calculateTotalPoints = (quizItems) => {
    let totalPoints = 0;
    quizItems.forEach(item => {
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