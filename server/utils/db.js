

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

export default {
    fetchQuizItems,
};