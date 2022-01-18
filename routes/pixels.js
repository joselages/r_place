const joi = require('joi');
const express = require('express');

const Pixel = require('../models/Pixel');

const router = express.Router();

router.get('/', async (req,res)=>{

    const pixels = await Pixel.find();

    res.send(pixels);

});

router.post('/', async (req, res) => {

    const test = {
        color: '#00F000',
        x: 1,
        y:2,
    };

    const pixel = new Pixel(test);

    await pixel.save();

    res.status(202).send(pixel)

});


module.exports = router;