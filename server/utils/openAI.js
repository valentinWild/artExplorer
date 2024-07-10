import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

const getChatCompletion = async (prompt) => {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });
    return chatCompletion;
}

export default {
    getChatCompletion,
};