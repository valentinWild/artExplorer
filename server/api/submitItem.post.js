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
        console.error('Error in submitItem handler:', error);
        return { error: error.message };
    }
    
});

// Check single quizItem (if solved correctly) -> return the quizItem with updated points and userAnswerIds
const checkQuizItem = async(quizItem, userSolutions) => {

    if (quizItem.type === "text_question") {
        if (userSolutions.answer_text) {
            const prompt = `Question: ${quizItem.content.stem}\nUser Answer: ${userSolutions.answer_text}\nEvaluate the user answer and provide a JSON response in the form:\n[{ "score": score from 0 (bad answer) to 1 (good answer), "correct_answer": Short scentece with correct answer}]`;
            const response = await openAI.getChatCompletion(prompt);
            const responseContent = response.choices[0].message.content.trim();
            const responseObject = JSON.parse(responseContent);
            if (responseObject[0]?.score !== undefined) {
                let score = 0 
                if (responseObject[0].score <= 0.2) {
                    score = 0;
                } 
                else if (responseObject[0].score >= 0.8) {
                    score = 1;
                }
                else {
                    score = responseObject[0].score;
                }
                quizItem.points = score;
                quizItem.user_answers = userSolutions.answer_text;
                quizItem.content.correct_answers = responseObject[0].correct_answer;
                quizItem.answered = true;
                return quizItem;
            } else {
                throw new Error('Could not validate the Question!');
            }
        }
    } else {
        const correctAnswerIds = quizItem.content.correct_answers.map(answer => answer.id);
        let userAnswerIds = [];
        if (userSolutions) {
            userAnswerIds = userSolutions.answer_ids;
        }
        let itemScore = 0;
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