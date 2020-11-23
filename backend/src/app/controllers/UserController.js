const createError = require('http-errors');
const utils = require('../../utils');
const User = require('../../app/models/User');
const passport = require('passport');

class AuthController {

    //TODO: [POST] /api/v1/user/
    async show(req, res, next) {
        try {
            const user = await User.findById(req.payload.id);

            if (!user) {
                return createError.Unauthorized();
            }

            return res.json({
                user
            });
        } catch (error) {
            return next(error);
        }
    }

}

module.exports = new AuthController;