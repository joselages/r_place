const mongoose = require('mongoose');
const User = require('./User');

const pixelSchema = new mongoose.Schema({
    color:{type:String, minlength:7,maxlength:7,required:true},
    x:{type:Number, min:0,maxlength:49,required:true},
    y:{type:Number, min:0,maxlength:49,required:true},
    user_id:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'User'},
    created_at:{type:Date, default:Date.now},
    updated_at:{type:Date, default: null},
});

const Pixel = mongoose.model('pixels', pixelSchema);

module.exports = Pixel;