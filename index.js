const express = require('express');
const app = express();
app.use(express.static(__dirname+ '/front'));

const http = require('http')
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server)

const mongoose = require('mongoose');

require('dotenv').config();

app.use(express.json());


mongoose.connect(process.env.MONGODB_URI || process.env.DB_LOCAL)
.then((data)=> console.log('connected'))
.catch((err)=>console.log(err))


const pixelRouter = require('./routes/pixels.js');
const userRouter = require('./routes/user.js');
const loginRouter = require('./routes/login.js');

app.use('/pixels', pixelRouter);
app.use('/users', userRouter);
app.use('/login', loginRouter);


io.on('connection', (socket) => {

    io.emit('user count', socket.client.conn.server.clientsCount)

    socket.on('log', (data) =>  {
        io.emit('checkin', data)
    });

    socket.on('disconnect', () => io.emit('user count', socket.client.conn.server.clientsCount));

    socket.on('pixel', (data) => io.emit('pixel', data));
})

server.listen(process.env.PORT);