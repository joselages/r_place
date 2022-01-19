const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{type:String, minlength:5, maxlength:15,required:true},
    email:{type:String, maxlength:252,required:true, unique:true},
    password:{type:String,required:true},
    created_at: {type: Date,default:Date.now, required: true},
});


const User = mongoose.model('User', userSchema);

module.exports = User;