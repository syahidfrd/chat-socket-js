const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connect', socket => {
  console.log(`Socket ${socket.id} is connected`);

  socket.on('subscribe', room => {
    socket.join(room);
  });

  socket.on('chat', data => {
    io.to(data.room).emit('chat', data);
  });

  socket.on('typing', data => {
    socket.to(data.room).emit('typing', data);
  });

  socket.on('chat-public', data => {
    io.emit('chat-public', data);
  });

  socket.on('typing-public', data => {
    socket.broadcast.emit('typing-public', data);
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} is disconnected`);
  });
});

http.listen(3000, console.log('Listening on port 3000...'));
