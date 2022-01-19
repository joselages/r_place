const joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const User = require('../models/User');

const validationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(100).required(),
});

router.get('/login', (req,res) => {

    res.sendFile(__dirname+'/front/login.html')

})

router.post('/', async (req, res) => {

    const login = req.body;
    
    const error = validationSchema.validate(login).error;

    if(error){
        return res.status(400).send({message:error.details[0].message});
    }

    const user = await User.findOne({email:login.email}).lean();
    if(!user){
        return res.status(401).send({ message: "Invalid email or password" });
    }
    
    const loginCorrect = await bcrypt.compare(login.password,user.password);

    if(loginCorrect === false){
        return res.status(401).send({ message: "Invalid email or password" });
    }

    //gerar jwt

    res.send(login)
})

module.exports = router;