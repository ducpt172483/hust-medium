var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
const createError = require('http-errors');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    },
    (email, password, done) => {
        User.findOne({
            email
        }, async (err, user) => {
            const isValid = await user?.validPassword(password);
            if (err) {
                return done(err);
            }
            if (!user || !isValid) {
                return done(null, false, createError.BadRequest('Invalid username/password'));
            }
            return done(null, user);
        });
    }
));