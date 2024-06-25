import { defineEventHandler } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);

    const { data: quiz, error } = await client
        .from('quizzes')
        .insert([
            { score: 0.0, owner: user.id },
        ])
        .select();

    const {data, error2} = await client
        .from('quiz_items')
        .insert([
            {type: 'mcq', quiz_id: quiz[0].id, content: {some: 'content'}},
            {type: 'gaps', quiz_id: quiz[0].id, content: {some: 'other content'}},
            {type: 'others', quiz_id: quiz[0].id, content: {some: 'and also othercontent'}},
        ]);

    if (error2) {
        return error2
    } else return quiz;

});