const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    body: String,
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    article: {
        typw: mongoose.Types.ObjectId,
        ref: "Article",
    },
}, {
    timestamps: true,
});

CommentSchema.method.toJSONFor = function(user) {
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        author: this.author.toProfileJSONFor(user)
    };
};

module.exports = mongoose.model('Comment', CommentSchema);