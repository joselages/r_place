const mongoose = require('mongoose');

const pixelSchema = new mongoose.Schema({
    color:{type:String, minlength:7,maxlength:7,required:true},
    x:{type:Number, min:0,maxlength:49,required:true},
    y:{type:Number, min:0,maxlength:49,required:true},
    created_at:{type:Date, default:Date.now},
    updated_at:{type:Date, default: null},
});

const Pixel = mongoose.model('pixels', pixelSchema);

module.exports = Pixel;