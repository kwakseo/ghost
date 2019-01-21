const express = require("express");
const session = require('express-session');
const path = require("path");

/*const http = require("http").Server(express);
const io = require("socket.io")(http);*/
const http = require("http");
const socketio = require("socket.io");
const bodyParser = require('body-parser');

const User = require('./models/user');
const db = require('./db');
const passport = require('./passport');
const api = require('./routes/api');

const { initNewGame, gameUpdate, gameAddUser, shuffleArray } = require("./game");

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
    });
  

app.get('/user', function(req, res) {
    User.findOne({ _id: req.query._id }, function(err, user) {

        console.log('in find one');
    });
});

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
let allRooms = {};
let clientToSocketIdMap = {};

io.on("connection", (socket) => {
  numConnected += 1;
  console.log("a user connected they are user number " + numConnected);


socket.on("letter-added", (letters) => {
  game = allRooms[socket.room.toString()];
  console.log("letter added emit");
  game.letters += letters[letters.length -1];
  socket.broadcast.to(socket.room).emit("letter-added", letters[letters.length -1]);

  gameUpdate(game, letters).then(() => {
    console.log(game)
    if (game.gameOver) {
      io.in(socket.room).emit("game-over", game);
    }

    else {
      io.in(socket.room).emit("game-update", game);
  }
  })
  });
//once game has ended remove game number from list

socket.on('roomCreated', (roomNoUserInfo) =>  {
  const userInfo = roomNoUserInfo.userInfo;
  let roomNo = roomNoUserInfo.roomNo;

  while (roomNo.toString() in allRooms) {
    roomNo = Math.floor((Math.random() * 100000) + 1);
  };

  socket.room = roomNo;
  socket.join(roomNo);
  game = initNewGame();
  console.log(allRooms[roomNo.toString()]);

  game.roomNo = roomNo;
  const socketid = socket.id.toString();
  game.players[socketid] = {alive: true, index: 0, ghost: 0, userInfo: userInfo};
  game.indexMap[0] = socketid;
  game.playerOrder = [0];
  game.timer = 10;

  console.log("init game");
  console.log(game);
  console.log("info");
  console.log(userInfo);
  io.to(socket.room).emit("gameInit", game, userInfo, socketid);

  allRooms[roomNo.toString()] = game;
  console.log("userinfo, appjs: " + userInfo);
});

socket.on('roomChosen', (roomNoUserInfo) => {
  const roomNo = roomNoUserInfo.roomNo;
  const userInfo = roomNoUserInfo.userInfo;
  if (!(roomNo.toString() in allRooms) || !allRooms[roomNo.toString()].joinable) {
    console.log("appjs checking joinable");
    console.log(allRooms[roomNo.toString()]);
    console.log(allRooms[roomNo.toString()].joinable);
    console.log("appjs checking in rooms");
    console.log(roomNo.toString() in allRooms);
    io.sockets.in(socket.id).emit('roomInvalid', roomNo);
  }

  else {
    if (io.sockets.adapter.rooms[roomNo].length < 4) {
      console.log("valid room");
      socket.join(roomNo);
      game = allRooms[roomNo.toString()];
      game.numPlayers += 1;
      const index = game.numPlayers - 1;
      console.log("num players " + game.numPlayers);

      socketid = socket.id.toString();
      game.indexMap[index] = socketid;
      let updateOrder = [];

      for (var i of game.playerOrder) {
        updateOrder.push(i);
        console.log(i);
      };

      updateOrder.push(index);
      game.playerOrder = updateOrder;
      game.players[socket.id.toString()] = {alive: true, index: index, ghost: 0, userInfo: userInfo};
      console.log(game.playerOrder);
      socket.room = roomNo;
      io.to(socket.room).emit('roomJoined', game, userInfo, socketid);
/*      io.sockets.in(socket.id).emit('roomJoined', {roomNo: roomNo, userInfo: userInfo, socketId: socket.id});*/
    }
    else {
      console.log("too many players");
      allRooms[roomNo.toString()].joinable = false;
      roomNo = -1;
      io.sockets.in(socket.id).emit('roomInvalid', roomNo);
    }
  }
});

socket.on('gameStarted', (roomNo) => {
  game = allRooms[roomNo.toString()];
  let index = 0;


  shuffleArray(game.playerOrder);
  console.log("player order");
  console.log(game.playerOrder);
  game.activePlayerIndex = game.playerOrder[0];
  allRooms[roomNo.toString()].joinable = false;

  io.to(socket.room).emit('gameStartedGo', game);

});




  socket.on("disconnect", () => {
    console.log("a user dced");
    numConnected -= 1;
    if (numConnected === 0) {
      gameStarted = false;
    }
  });
  });

