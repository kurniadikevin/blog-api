const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title : {type: String, required: true},
    body : {type: String, required: true},
    author : { type : Schema.Types.ObjectId, ref : "User"},
    date :  { type: Date, default: Date.now }
});

//virtual message url
PostSchema.virtual("url").get(function(){
    return `/message/${this._id}`;
})

module.exports= mongoose.model("Post",PostSchema)

