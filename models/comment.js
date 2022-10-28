const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text_comment : {type: String, required: true},
    author : { type: String, required: true},
    date :  { type: Date, default: Date.now },
    postId : {type: String, required: true}
});

//virtual message url
CommentSchema.virtual("url").get(function(){
    return `/message/${this._id}`;
})

module.exports= mongoose.model("Comment",CommentSchema)

