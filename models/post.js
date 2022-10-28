const mongoose = require('mongoose');
const Comment = require("../models/comment");

const Schema = mongoose.Schema;

const defaultAuthor = {
    name : 'anonymous'
}
const PostSchema = new Schema({
    title : {type: String, required: true},
    body : {type: String, required: true},
    author : {type: String},
    date :  { type: Date, default: Date.now },
    comment : { type : Schema.Types.ObjectId, ref : "Comment" }
});

//virtual message url
PostSchema.virtual("url").get(function(){
    return `/posts/${this._id}`;
})

module.exports= mongoose.model("Post",PostSchema)



