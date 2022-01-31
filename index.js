const express = require('express');
const app = express();

const http = require('http')
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server)

const mongoose = require('mongoose');

const pixelRouter = require('./routes/pixels.js');
const userRouter = require('./routes/user.js');
const loginRouter = require('./routes/login.js');

require('dotenv').config();

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

io.on('connection', (socket) => {

    socket.on('pixel', (data) => io.emit('pixel', data));
})

server.listen(process.env.PORT);