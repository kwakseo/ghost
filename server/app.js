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

const { initNewGame, gameUpdate, shuffleArray } = require("./game");

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

/*app.get(['/profile/:user'], function (req, res) {
  res.sendFile(path.join(__dirname, '../socket/dist', 'index.html'));
});*/

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

/*app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/'); 
});*/

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


/*const port = 3000; // config variable
const server = http.Server(app);*/
const server = http.Server(app);
const io = socketio(server);
app.set('socketio', io);

server.listen(3000, () => {
  console.log(`Listening on port 3000 and looking in folder ${publicPath}`);
});

let numConnected = 0;
let gameStarted = false;
let game = {};
let allRooms = {};

io.on("connection", (socket) => {
  numConnected += 1;
  console.log("a user connected they are user number " + numConnected);


socket.on("letter-added", (letter) => {
  socket.broadcast.to(socket.room).emit("letter-added", letter[letter.length -1]);
  console.log(letter);
  gameUpdate(game, letter);
});

//once game has ended remove game number from list

socket.on('roomCreated', (roomNo) =>  {
  while (roomNo.toString() in allRooms) {
    roomNo = Math.floor((Math.random() * 100000) + 1);
  };
  socket.room = roomNo;
  allRooms[roomNo.toString()] = {joinable: true, users: [socket.id], numUsers: 1};
  console.log("created allRooms")
  console.log(allRooms);

  socket.join(roomNo);
  io.in(socket.room).emit('roomCreated', roomNo);
});

socket.on('roomChosen', (roomNo) => {
  console.log("chosen allRooms");
  console.log(allRooms);
  console.log(roomNo);

  if (!(roomNo.toString() in allRooms) || !allRooms[roomNo.toString()].joinable) {
    console.log("!allRooms")
    roomNo = -1;
    io.sockets.in(socket.id).emit('roomChosen', roomNo);
  }

  else {
    if (io.sockets.adapter.rooms[roomNo].length < 4) {
      console.log("valid")
      socket.join(roomNo);
      allRooms[roomNo.toString()].users.push(socket.id);
      allRooms[roomNo.toString()].numUsers = allRooms[roomNo.toString()].numUsers + 1;
      socket.room = roomNo;
      io.sockets.in(socket.id).emit('roomChosen', roomNo);
    }
    else {
      console.log("too many players");
      allRooms[roomNo.toString()] = {joinable: false};
      roomNo = -1;
      io.sockets.in(socket.id).emit('roomChosen', roomNo);
    }
  }
});

socket.on('gameStarted', (msg) => {
  // allRooms.delete(socket.room.toString());
  allRooms[socket.room.toString()].joinable = false;
  console.log('heard?');

  game = initNewGame();
  game.roomNo = socket.room.toString();
  let index = 0;
  for (userId of allRooms[socket.room.toString()].users) {
    game.players[userId] = {alive: true, index: index, ghost: 0}
    game.playerOrder.push(index);
    game.indexMap[index] = userId;
    index += 1;
  }
  shuffleArray(game.playerOrder);
  game.activePlayer = game.playerOrder[0];
  game.activePlayerIndex = 0;
  game.timer = 10;
  console.log("init game");
  console.log(game);


  // socket.emit("new_game", game);
  // gameStarted = true;

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

