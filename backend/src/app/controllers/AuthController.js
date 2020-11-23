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
                    user.token = user.generateJWT();
                    return res.json({
                        user: user.toAuthJSON(user.token)
                    });
                } else {
                    return res.status(422).json(info);
                }
            })(req, res, next);
        } catch (error) {
            // if (error.isJoi === true) {
            //     return next(createError.BadRequest('Invalid username/password'));
            // }
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

            newUser.token = newUser.generateJWT();
            return res.json({
                user: newUser.toAuthJSON(newUser.token)
            });


        } catch (error) {
            if (error.isJoi === true) error.status = 422;
            next(error);
        }
    }
}

module.exports = new AuthController;