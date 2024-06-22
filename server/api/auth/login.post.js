import User from "~/server/models/User.js";
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const {email, password} = await readBody(event);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User-Email does not exist!'});
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid password'});
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn : '1h'}, (err, token) => {
            if (err) throw err;
            res.json({ token});
        });
    } catch {
        console.error(err.message);
        res.status(500).send(err.message);
    }

});