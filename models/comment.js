const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text_comment : {type: String, required: true},
    author : { type : Schema.Types.ObjectId, ref : "User"},
    date :  { type: Date, default: Date.now }
});

//virtual message url
CommentSchema.virtual("url").get(function(){
    return `/message/${this._id}`;
})

module.exports= mongoose.model("Comment",CommentSchema)

