var express = require('express');
var app = express();
var socket = require('socket.io');
//test :: need to delete before publish
var rooms = [3];
var path = require('path');
app.use(express.static('public'));
app.get('*/bundle.js', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/bundle.js'))
})
server = app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
}).listen(8080, () => console.log('Server on port 3000'))


io = socket(server);

io.on('connection', (socket) => {
    console.log(socket.id + 'is connected');
    socket.on('disconnect', function() {
        console.log('user: ' + socket.id + 'is disconnected');
    });
    socket.on('CREATE_ROOM', function(data) {
        if (!rooms.includes(data.roomNum)) {
            socket.emit('SUCCESS', { type: 'success-2', msg: 'SUCCESS#2: You successfully create a game room' });
            socket.join(data.roomNum);
            rooms.push(data.roomNum);
        } else {
            socket.emit('ERROR', { type: 'error-2', msg: 'ERROR#2: This room number has been taken!' })
        }
    });
    socket.on('GAME_SETTING', function(data) {
        socket.join(data.roomNum);
        io.in(data.roomNum).emit('SET_GAME', data);
        console.log(data);
    });
    socket.on('JOIN_ROOM', function(data) {
        if (rooms.includes(parseInt(data.roomNum))) {
            socket.join(data.roomNum);
            socket.emit('SUCCESS', { type: 'success-1', msg: 'SUCCESS#1: You successfully join room: ' + data.roomNum });
            io.sockets.in(data.roomNum).emit('CONNECT_TO_ROOM', { roomNum: data.roomNum, groupNum: data.groupNum });
        } else {
            socket.emit('ERROR', { type: 'error-1', msg: 'ERROR#1: There is no such room!' });
        }
    });
})