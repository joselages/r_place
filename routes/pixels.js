const joi = require('joi');
const express = require('express');

const Pixel = require('../models/Pixel');

const router = express.Router();

router.get('/', async (req,res)=>{

    const pixels = await Pixel.find();

    res.send(pixels);

});

router.post('/', async (req, res) => {

    const body = req.body;

    console.log(body)
    // const pixel = new Pixel(test);

    // await pixel.save();

    res.status(202).send(body);

});


module.exports = router;