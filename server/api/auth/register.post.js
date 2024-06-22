import User from "../../models/User.js";
import jwt from 'jsonwebtoken';
import { defineEventHandler, createError, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, email, password } = body;

    if (!username || !email || !password) {
        throw createError({statusCode: 400, message: 'Please enter all fields'});
    }

    let user = await User.findOne({email});
    if (user) {
        throw createError({ statusCode: 400, message: 'User already exists'});
    }

    user = new User({
        username,
        email,
        password,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token };
});