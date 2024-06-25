import db from "../utils/db";
import { serverSupabaseClient } from '#supabase/server';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);
  
    try {
        const body = await readBody(event);
        /* console.log(body);
        const data = JSON.parse(body);  */
        if (!body.quiz_id || !body.items) {
            throw new Error("Invalid quiz data. Quiz ID and items are required.");
        }
        const userSolutions = body.items;
        const quizItems = await db.fetchQuizItems(client, body.quiz_id);
        console.log(quizItems);
        const result = await checkQuizItems(client, quizItems, userSolutions);
        return result;

    } catch (error) {
        return error;
    }
    
});


const checkQuizItems = async(client, quizItems, userSolutions) => {
    /* const itemsTotal = quizItems.length; */
    
    quizItems.forEach(item => {
        const correctAnswerIds = item.content.correct_answers.map(answer => answer.id);
        const userSolution = userSolutions.find(solution => solution.id === item.id);
        let userAnswerIds = [];
        if (userSolution) {
            userAnswerIds = userSolution.answer_ids;
        }

        const valuesEqual = correctAnswerIds.every(answerId => userAnswerIds.includes(answerId));
        if (valuesEqual) {
            console.log('Correct');
        } else {
            console.log('Wrong');
        }
        console.log(correctAnswerIds);
        console.log(userAnswerIds);
        return 'nothing';
    });
}

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