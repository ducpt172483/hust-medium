const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const uniqueValidator = require('mongoose-unique-validator');

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

UserSchema.plugin(uniqueValidator, {
    message: 'User is already exists!'
});

UserSchema.methods.validPassword = async function (password) {
    try {
        let isValid = await bcrypt.compare(password, this.password);
        return isValid;
    } catch (error) {
        return createError.Conflict('UserSchema valid password error');
    }
};

UserSchema.methods.generateJWT = function () {
    return jwt.sign({
        id: this._id,
        username: this.username,
        // 1d
        exp: Math.floor(Date.now() / 1000) + (60 * 60),

        // 30s
        // exp: Math.floor(Date.now() / 1000) + (30),
    }, privateKey);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        fullName: this.fullName,
        email: this.email,
        accessToken: this.generateJWT(),
        bio: this.bio,
        image: this.image,
        password: this.password
    };
};

module.exports = mongoose.model('User', UserSchema);