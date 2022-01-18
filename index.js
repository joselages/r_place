const express = require('express');
const mongoose = require('mongoose');

const app = express();

const pixelRouter = require('./routes/pixels.js');

mongoose.connect(`mongodb://localhost/r_place`)
.then((data)=> console.log('connected'))
.catch((err)=>console.log(err))

app.use('/pixels', pixelRouter);

app.listen(3000);