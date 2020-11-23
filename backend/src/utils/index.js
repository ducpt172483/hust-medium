const bcrypt = require('bcrypt');
const jwtExpress = require('express-jwt');
const Joi = require('joi');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
    try {
        let hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw createError.Conflict('Hash password error');
    }
};

const validPassword = async (password, hashPassword) => {
    try {
        let isValid = await bcrypt.compare(password, hashPassword);
        return isValid;
    } catch (error) {
        throw createError.Conflict('Valid password error');
    }
};

const signAccessToken = async (user) => {
    const privateKey = process.env.JWT_SECRET_FOR_ACCESS_TOKEN;

    const token = jwt.sign(user, privateKey);

    return token;
};

const verifyAccessToken = async (token) => {
    const privateKey = process.env.JWT_SECRET_FOR_ACCESS_TOKEN;

    const decoded = await jwt.verify(token, privateKey);

    return decoded;
};

const getTokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }

    return null;
};

const auth = {
    required: jwtExpress({
        secret: process.env.JWT_SECRET_FOR_ACCESS_TOKEN,
        userProperty: 'payload',
        algorithms: ['HS256'],
        getToken: getTokenFromHeader
    }),
    optional: jwtExpress({
        secret: process.env.JWT_SECRET_FOR_ACCESS_TOKEN,
        userProperty: 'payload',
        credentialsRequired: false,
        algorithms: ['HS256'],
        getToken: getTokenFromHeader
    })
};

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required()
});



module.exports = {
    hashPassword,
    validPassword,
    auth,
    authSchema,
}