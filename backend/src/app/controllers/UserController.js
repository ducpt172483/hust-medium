const createError = require('http-errors');
const utils = require('../../utils');
const User = require('../../app/models/User');
const passport = require('passport');

class AuthController {

    //TODO: [POST] /api/v1/user/
    async show(req, res, next) {
        try {
            console.log(req.payload);
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

    //TODO: [PUT] /api/v1/user/
    async update(req, res, next) {
        try {
            const user = await User.findById(req.payload.id);

            if (!user) return createError.Unauthorized();

            const { fullName, email, bio, image, password } = req.body;
            // only update fields that were actually passed...
            if (typeof fullName !== 'undefined') {
                user.fullName = fullName;
            }
            if (typeof email !== 'undefined') {
                user.email = email;
            }
            if (typeof bio !== 'undefined') {
                user.bio = bio;
            }
            if (typeof image !== 'undefined') {
                user.image = image;
            }
            if (typeof password !== 'undefined') {
                user.password = await utils.hashPassword(password);
            }
            
            await user.save();
           
            return res.json({
                user: user.toAuthJSON()
            });
        } catch (error) {
            return next(error);
        }
    }

}

module.exports = new AuthController;