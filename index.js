const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var spots = [null, null]

app.use(express.static("public"))

io.on('connection', (socket) => {
  socket.on('Game Board', (board, gmoves, color) => {
    socket.broadcast.emit('Game Board', board, gmoves, color);
  });

  socket.on('castle', (board, color) => {
    io.emit('castle', board, color);
  });

  socket.on('ID', (id, gColor) => {
    io.emit("ID", id, gColor);
  });

  socket.on('promotion', (x, y, piece) => {
    socket.broadcast.emit('promotion', x, y, piece);
  });

  socket.on('mate', () => {
    socket.broadcast.emit('mate');
  });

  socket.on('color', () => {
    // if (!spots[0]){
    //   spots[0] = 1
    //   var color = "white"
    // } else if (!spots[1]) {
    //   spots[1] = 1
    //   var color = "black"
    // } else {
    //   var color = "spectator"
    // }
    color = Math.random() > 0.5 && "white" || "black"
    socket.emit("color", color)
  })

  socket.on('disconnect', function() {
    if (spots[0]){
      spots[0] = null
    } else if (spots[1]) {
      spots[1] = null
    }
  });
});

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});