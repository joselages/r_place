const joi = require('joi');
const express = require('express');
const auth = require('../middleware/auth');

const Pixel = require('../models/Pixel');

const router = express.Router();

const validationSchema = joi.object({
    color: joi.string().trim().min(7).max(7).required(),
    x: joi.number().min(0).max(49).required(),
    y: joi.number().min(0).max(49).required()
})

router.get('/', async (req,res)=>{

    const pixels = await Pixel.find().populate('user_id','username').lean();

    res.send(pixels);

});

router.post('/', auth, async (req, res) => {

    let newPixel = req.body;

    const error = validationSchema.validate(newPixel).error;

    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    newPixel['user_id'] = req.userPayload._id;

    try{
        
        const exists = await Pixel.find({x:newPixel.x, y:newPixel.y}).lean();
        
        let pixel;
        
        if(exists.length){
            const now = new Date;
            newPixel['updated_at'] = now;
            
            pixel = await Pixel.findByIdAndUpdate( exists[0]._id, newPixel,{
                new: true,
              });

        } else {  
            pixel = await new Pixel(newPixel);
            
            await pixel.save();
        }
        
        res.status(202).send(pixel);
    } catch(ex){
        console.log(ex)
        res.status(400).send({ message: "Bad request" });
    }

});


module.exports = router;