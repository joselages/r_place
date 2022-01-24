const express = require('express');
const mongoose = require('mongoose');

const pixelRouter = require('./routes/pixels.js');
const userRouter = require('./routes/user.js');
const loginRouter = require('./routes/login.js');

require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`)
.then((data)=> console.log('connected'))
.catch((err)=>console.log(err))

app.get('/', (req,res) => {

    res.sendFile(__dirname+'/front/index.html')

})

app.get('/signup', (req,res) => {

    res.sendFile(__dirname+'/front/signup.html')

})



app.use('/pixels', pixelRouter);
app.use('/users', userRouter);
app.use('/login', loginRouter);

app.listen(process.env.PORT);