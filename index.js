const express = require('express');
const mongoose = require('mongoose');



const pixelRouter = require('./routes/pixels.js');

const app = express();
app.use(express.json());

mongoose.connect(`mongodb://localhost/r_place`)
.then((data)=> console.log('connected'))
.catch((err)=>console.log(err))

app.get('/', (req,res) => {

    res.sendFile(__dirname+'/front/index.html')

})

app.use('/pixels', pixelRouter);

app.listen(3000);