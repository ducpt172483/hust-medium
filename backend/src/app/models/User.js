const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const createError = require('http-errors');

const privateKey = process.env.JWT_SECRET_FOR_ACCESS_TOKEN;

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
    },
    bio: String,
    image: String,
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true
});

UserSchema.methods.validPassword = async function (password) {
    try {
        let isValid = await bcrypt.compare(password, this.password);
        return isValid;
    } catch (error) {
        return createError.Conflict('UserSchema valid password error');
    }
};

UserSchema.methods.generateJWT = function() {
    return jwt.sign({
      id: this._id,
      username: this.username,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }, privateKey);
};

UserSchema.methods.toAuthJSON = function (accessToken) {
    return {
        fullName: this.fullName,
        email: this.email,
        accessToken,
        bio: this.bio,
        image: this.image
    };
};

module.exports = mongoose.model('User', UserSchema);