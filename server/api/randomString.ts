import { defineEventHandler } from 'h3'
import axios from 'axios'
import User from '../models/User'

const fetchExternalData = async () => {
    const response = await axios.get('https://api.example.com/data')
    return response.data
}

/* const generateRandomString = (data) => {
    const randomIndex = Math.floor(Math.random() * data.length)
    return data[randomIndex]
} */

function generateRandomString(length: number, useSpecialChars = false) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    const charSet = useSpecialChars ? chars + specialChars : chars;
    
    let result = '';
    const charSetLength = charSet.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSetLength);
        result += charSet[randomIndex];
    }

    return result;
}

export default defineEventHandler(async (event) => {
    try {
        // Example of interacting with the database
        /* const user = await User.findOne({ email: 'test@example.com' }) */
        
       /*  const data = await fetchExternalData() */
       /*  const randomString = generateRandomString(data); */
       
       const randomString = generateRandomString(10);

        return { randomString/* , user  */}
    } catch (error) {
        event.res.statusCode = 500
        return { error: 'Failed to generate random string' }
    }
});