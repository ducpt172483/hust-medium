const createError = require('http-errors');
const utils = require('../../utils');
const User = require('../../app/models/User');

class AuthController {

    //TODO: [POST] /api/v1/auth/login
    async login(req, res, next) {
        try {
            const result = await utils.authSchema.validateAsync(req.body);
            
            let user = await User.findOne({ email: result.email });

            if(!user) {
                throw createError.NotFound('User not register');
            }
            // console.log(user);
            const isMatch = await utils.validPassword(result.password, user.password);

            if(!isMatch) {
                throw createError.Unauthorized('Username/password not valid');
            }

            const payload = {
                _id: user._id,
                email: user.email,
                password: user.password
            }

            const accessToken = await utils.signAccessToken(payload);

            res.json({
                accessToken,
                user: payload
            });
        } catch (error) {
            if(error.isJoi === true) {
                return next(createError.BadRequest('Invalid username/password'));
            }
            return next(error);
        }
    }

    //TODO: [POST] api/v1/auth/register
    async register(req, res, next) {
        try {
            const result = await utils.authSchema.validateAsync(req.body);

            const user = await User.findOne({ 
               email: result.email
            });

            if (user) {
                throw createError.Conflict('User already exists');
            }

            result.password = await utils.hashPassword(result.password);
            
            let newUser = await User.create(result);
            await newUser.save();

            const payload = {
                _id: newUser._id,
                email: newUser.email,
                password: newUser.password
            }
            
            const accessToken = await utils.signAccessToken(payload);

            res.json({
                accessToken,
                user: payload
            });
        } catch (error) {
            if(error.isJoi === true) error.status = 422;
            next(error);
        }
    }
}

module.exports = new AuthController;