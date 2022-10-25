const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname : {type: String, required: true},
    username :  {type: String, required: true},
    password : { type: String, required: true},
    admin : {type:Boolean, default:false}
});

//virtual user url
UserSchema.virtual("url").get(function(){
    return `/user/${this._id}`;
})

// export model
module.exports = mongoose.model("User",UserSchema);