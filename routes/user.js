const joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');

const app = express();

app.use(express.json());

const User = require('../models/User');

const router = express.Router();

const validationSchema = joi.object({
    username: joi.string().trim().min(5).max(15).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(100).required()
})

router.post('/', async (req,res) =>{

    const newUser = req.body;

    const error = validationSchema.validate(newUser).error;

    if(error){
        return res.status(400).send({message:error.details[0].message})
    }

    try{

        newUser.password = await bcrypt.hash(newUser.password, 10);

        const user = new User(newUser);

        await user.save();

        res.status(202).send(user)

    }
    catch(ex){
        return res.status(400).send({ message: "Bad request" })
    }

});

module.exports = router;