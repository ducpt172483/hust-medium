const createError = require('http-errors');
const utils = require('../../utils');
const User = require('../../app/models/User');
const passport = require('passport');

class AuthController {

    //TODO: [POST] /api/v1/auth/login
    async login(req, res, next) {
        try {
            passport.authenticate('local', {
                session: false
            }, function (err, user, info) {
                if (err) {
                    return next(err);
                }
                
                if (user) {
                    return res.json({
                        user: user.toAuthJSON()
                    });
                } 
                
                next(info);
                
            })(req, res, next);
        } catch (error) {
            return createError.Unauthorized();
        }
    }

    //TODO: [POST] api/v1/auth/register
    async register(req, res, next) {
        try {
            const result = await utils.authSchema.validateAsync(req.body);

            result.password = await utils.hashPassword(result.password);

            let newUser = await User.create(result);
            await newUser.save();

            return res.json({
                user: newUser.toAuthJSON()
            });


        } catch (error) {
            if (error.isJoi === true) return createError.UnprocessableEntity();
            next(error);
        }
    }
}

module.exports = new AuthController;