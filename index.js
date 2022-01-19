const express = require('express');
const mongoose = require('mongoose');

const pixelRouter = require('./routes/pixels.js');
const userRouter = require('./routes/user.js');
const loginRouter = require('./routes/login.js');

const app = express();
app.use(express.json());

mongoose.connect(`mongodb://localhost/r_place`)
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

app.listen(3000);