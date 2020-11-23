const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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