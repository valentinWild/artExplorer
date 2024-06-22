import { defineEventHandler } from 'h3'

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export default defineEventHandler(async (event) => {
    try {
        // Example of interacting with the database
        /* const user = await User.findOne({ email: 'test@example.com' }) */
        
       /*  const data = await fetchExternalData() */
       /*  const randomString = generateRandomString(data); */
       
       const randomNumber = generateRandomNumber(1, 1000);

        return { randomNumber }
    } catch (error) {
        event.res.statusCode = 500
        return { error: 'Failed to generate random number' }
    }
});