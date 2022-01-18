const joi = require('joi');
const express = require('express');

const Pixel = require('../models/Pixel');

const router = express.Router();

router.get('/', async (req,res)=>{

    const pixels = await Pixel.find();

    res.send(pixels);

});

router.post('/', async (req, res) => {

    const newPixel = req.body;


    try{
        const pixel = await new Pixel(newPixel);
        
        await pixel.save();
        
        res.status(202).send(newPixel);
    } catch(ex){
        res.status(400).send({ message: "Bad request" });
    }

});


module.exports = router;