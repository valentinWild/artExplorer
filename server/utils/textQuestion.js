
const createTextQuestions = async (epoch, numOfQuestions) => {

/*     const test = [
        {
          "type": "text_question",
          "content": {
            "stem": "How did the Modernist art movement challenge traditional artistic norms and conventions?"
          }
        },
        {
          "type": "text_question",
          "content": {
            "stem": "In what ways did Modernism reflect the shifting cultural and social landscape of the early 20th century?"
          }
        }
      ];
    return test; */

    const basePrompt = `Generate ${numOfQuestions} open-ended questions about art style ${epoch} which can be ansered in 2-3 Scentences.`
    const response = await openAI.getChatCompletion(basePrompt);

    const questions = []

    if (response?.choices[0].message.content) {
        const responseContent = response.choices[0].message.content.trim();
        const quizQuestions = responseContent
            .split('\n')
            .map(question => question.replace(/^\d+\.\s*/, ''));

        if (quizQuestions.length > 0) {

            for (let i = 0; i < quizQuestions.length; i++) {
              const stem = quizQuestions[i];

              questions.push({
                type: 'text_question',
                content: {
                  stem: stem,
                }
              });
            }

            return questions;
            
        } else {
            return new Error("Could not parse openAI generated Questions.");
        }

    } else {
        return new Error("Could not generate text questions with openAI.");
    }

} 



export default {
    createTextQuestions,
};