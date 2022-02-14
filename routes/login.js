const joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');

const validationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(100).required(),
});

const { dirname } = require('path');
const appDir = dirname(require.main.filename);

router.get('/', (req,res) => {

    res.sendFile(appDir+'/front/login.html')

})

router.post('/', async (req, res) => {

    const login = req.body;
    
    const error = validationSchema.validate(login).error;

    if(error){
        return res.status(400).send({message:error.details[0].message});
    }

    const user = await User.findOne({email: login.email}).lean();
    if(!user){
        return res.status(401).send({ message: "Invalid email or password" });
    }
    
    const loginCorrect = await bcrypt.compare(login.password,user.password);

    if(loginCorrect === false){
        return res.status(401).send({ message: "Invalid email or password" });
    }

    const payload = {
        _id: user._id,
        name: user.username,
        email: user.email
    }

    jwt.sign(payload, process.env.JWT_SECRET_KEY, (err, token) => {

        // if(err){
        //     return res.status(500).send({ message: err })
        // }

        res.header({ "X-Auth-Token": token }).send({
             "X-Auth-Token": token,
             "username": user.username 
        })
    });

})

module.exports = router;