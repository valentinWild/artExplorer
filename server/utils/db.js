
const fetchQuizItems = async (client, quizId) => {
    const { data: quizItems, error: error } = await client
        .from('quiz_items')
        .select('*')
        .eq('quiz_id', quizId);
    if (error) {
        return {'Error fetching quiz items from db': error};
    } 
    return quizItems;
}

const fetchQuizItemsResults = async (client, quizId) => {
    const { data: quizItems, error: error } = await client
        .from('quiz_items')
        .select('points')
        .eq('quiz_id', quizId);
    if (error) {
        return {'Error fetching quiz items from db': error};
    } 
    return quizItems;
}

const fetchSingleQuizItem = async (client, itemId) => {
    const { data: quizItem, error: error } = await client
        .from('quiz_items')
        .select('*')
        .eq('id', itemId);
    if (error) {
        return {'Error fetching quiz items from db': error};
    } 
    return quizItem;
}

const updateQuizItems = async (client, fieldsToUpdate) => {
    const { data: quizItems, error: error } = await client
        .from('quiz_items')
        .upsert(fieldsToUpdate, { onConflict: 'id' }) 
        .select('*');
    if (error) {
        return new Error({'Error updating quizItems': error});
    } 
    return quizItems;
}

const updateSingleQuizItem = async (client, itemId, fieldsToUpdate) => {
    const { data: quizItems, error: error } = await client
        .from('quiz_items')
        .update(fieldsToUpdate) 
        .eq('id', itemId)
        .select('*');
    if (error) {
        return new Error({'Error updating quizItems': error});
    } 
    return quizItems;
}


const insertQuizItems = async(client, quizItems) => {
    const {data: items, error: itemError} = await client
        .from('quiz_items')
        .insert(quizItems)
        .select();
    if (itemError) {
        console.error(itemError);
    } 
    return items;
}

const insertQuiz = async(client, userId, styleCategory) => {
    const { data: quiz, error: quizError } = await client
        .from('quizzes')
        .insert([
            { score: 0.0, owner: userId, style_category: styleCategory },
        ])
        .select();

    if (quizError) {
        return quizError;
    } 

    return quiz;
}

const updateQuiz = async (client, quizId, fieldsToUpdate) => {
    const { data: quizItems, error: error } = await client
        .from('quizzes')
        .update(fieldsToUpdate)
        .eq('id', quizId)
        .select('*');
    if (error) {
        console.error(error);
        return new Error({'Error updating quiz': error});
    } 
    return quizItems;
}



export default {
    fetchSingleQuizItem,
    updateSingleQuizItem,
    fetchQuizItems,
    fetchQuizItemsResults,
    updateQuizItems,
    insertQuizItems,
    updateQuiz,
    insertQuiz,
};