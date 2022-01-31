const joi = require('joi');
const express = require('express');
const auth = require('../middleware/auth');

const Pixel = require('../models/Pixel');

const router = express.Router();

router.get('/', async (req,res)=>{

    const pixels = await Pixel.find().populate('user_id','username').lean();

    res.send(pixels);

});

router.post('/', auth, async (req, res) => {

    let newPixel = req.body;
    newPixel['user_id'] = req.userPayload._id;
    //falta a validação do pixel

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