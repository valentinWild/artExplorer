import jwt from 'jsonwebtoken';

export const authenticate = async (event) => {
    const headers = event.node.req.headers;
    const token = headers['x-auth-token'];

    if (!token) {
        throw createError({statusCode: 401, message: 'No token, authorization denied'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        event.context.user = decoded.user; 
    } catch (err) {
        throw createError({ statusCode: 401, message: 'Token is not valid' });
    }
};
