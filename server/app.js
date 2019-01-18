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

io.on("connection", (socket) => {
  numConnected += 1;
  console.log("a user connected they are user number " + numConnected);

  if (!gameStarted) {
    game = initNewGame();
  }

  socket.emit("new_game", game);
  gameStarted = true;


socket.on("letter-added", (letter) => {
  socket.broadcast.emit("letter-added", letter);
  console.log(letter);
});

  socket.on("disconnect", () => {
    console.log("a user dced");
    numConnected -= 1;
    if (numConnected === 0) {
      gameStarted = false;
    }
  });
});

