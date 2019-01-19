const express = require("express");
const session = require('express-session');
const path = require("path");

/*const http = require("http").Server(express);
const io = require("socket.io")(http);*/
const http = require("http");
const socketio = require("socket.io");
const bodyParser = require('body-parser');

const db = require('./db');
const passport = require('./passport');
const api = require('./routes/api');

const { initNewGame } = require("./game");

const app = express();
const publicPath = path.resolve(__dirname, '..', "client", "dist");

app.use(session({
  secret: 'session-secret',
  resave: 'false',
  saveUninitialized: 'true'
}));

app.use(express.static(publicPath));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate(
    'google',
    { failureRedirect: '/login' }
  ),
  function(req, res) {
    res.redirect('/success');
  }
);

app.get(["/success"], (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use('/api', api );
app.use(express.static(publicPath));

// 404 route
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// route error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message,
  });
});

const server = http.Server(app);
const io = socketio(server);
app.set('socketio', io);

server.listen(3000, () => {
  console.log(`Listening on port 3000 and looking in folder ${publicPath}`);
});

let numConnected = 0;
let gameStarted = false;
let game = {};
let allRooms = new Set();

io.on("connection", (socket) => {
  numConnected += 1;
  console.log("a user connected they are user number " + numConnected);

  if (!gameStarted) {
    game = initNewGame();
  }

  socket.emit("new_game", game);
  gameStarted = true;


socket.on("letter-added", (letter) => {
  socket.broadcast.to(socket.room).emit("letter-added", letter);
  console.log(letter);
});

//once game has ended remove game number from list

socket.on('roomCreated', (roomNo) =>  {
  while (allRooms.has(roomNo.toString())) {
    roomNo = Math.floor((Math.random() * 100000) + 1);
  };
  socket.room = roomNo;
  allRooms.add(roomNo.toString());
  console.log("created allRooms")
  console.log(allRooms);

  socket.join(roomNo);
  io.in(socket.room).emit('roomCreated', roomNo);
});

socket.on('roomChosen', (roomNo) => {
  console.log("chosen allRooms");
  console.log(allRooms);
  console.log(roomNo);

  if (!allRooms.has(roomNo.toString())) {
    console.log("!allRooms")
    roomNo = -1;
    io.sockets.in(socket.id).emit('roomChosen', roomNo);
  }

  else {
    if (io.sockets.adapter.rooms[roomNo].length < 4) {
      console.log("valid")
      socket.join(roomNo);
      socket.room = roomNo;
      io.sockets.in(socket.id).emit('roomChosen', roomNo);
    }
    else {
      console.log("too many players");
      roomNo = -1;
      io.sockets.in(socket.id).emit('roomChosen', roomNo);
    }
  }
});

socket.on('gameStarted', (msg) => {
  allRooms.delete(socket.room.toString());
  console.log('heard?');
  io.in(socket.room).emit('gameStarted', msg);
  io.in(socket.room).emit('numPlayers', io.sockets.adapter.rooms[socket.room].length);
});

  socket.on("disconnect", () => {
    console.log("a user dced");
    numConnected -= 1;
    if (numConnected === 0) {
      gameStarted = false;
    }
  });
});

