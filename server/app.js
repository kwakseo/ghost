require('dotenv').config();
const express = require("express");
const session = require('express-session');
const path = require("path");
const _ = require("underscore")

/*const http = require("http").Server(express);
const io = require("socket.io")(http);*/
const http = require("http");
const socketio = require("socket.io");
const bodyParser = require('body-parser');

const User = require('./models/user');
const History = require('./models/history')
const db = require('./db');
const passport = require('./passport');
const api = require('./routes/api');
require('dotenv').config();
// const router = express.Router();

const { initNewGame, gameUpdate, shuffleArray, removePlayers } = require("./game");

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
    { failureRedirect: '/' }
  ),
  function(req, res) {

    res.redirect('/success');
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/user', function(req, res) {
    User.findOne({ _id: req.query._id }, function(err, user) {

        console.log('in find one');
    });
});

app.get(["/success"], (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get(["/rules"], (req, res) => {
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

console.log("print port info");
console.log(process.env.PORT);

server.listen((process.env.PORT || 3000), () => {
  console.log(`Listening on port 3000 and looking in folder ${publicPath}`);
});

let numConnected = 0;
let gameStarted = false;
let game = {};
let allRooms = {};
let clientToSocketIdMap = {};
let userGoogleInfo = {};
let leaderboardInfo = [];

io.on("connection", (socket) => {
  numConnected += 1;
  console.log("a user connected they are user number " + numConnected);


socket.on("letter-added", (letters) => {
  game = allRooms[socket.room.toString()];
  console.log("letter added emit");
  game.letters += letters[letters.length -1];
/*  socket.broadcast.to(socket.room).emit("letter-added", letters[letters.length -1]);*/
  gameUpdate(game, letters).then(() => {
    console.log(game)
    if (game.playerDeath) {
      io.in(socket.room).emit("player-death", game);
    }
    if (game.gameOver) {
      io.in(socket.room).emit("game-over", game);
      updateDatabase();
    }

    else {
      io.in(socket.room).emit("game-update", game);
      }
    })
  });
//once game has ended remove game number from list

async function transitionAnimation(game) {

}

socket.on("user-info", (userInfo) => {
  console.log("userInfo");
  console.log(userInfo);
  if (userInfo === null) {
    userGoogleInfo = 'new user';
    clientToSocketIdMap[socket.id] = 'new user';
  } else{

    userGoogleInfo = userInfo;
    clientToSocketIdMap[socket.id] = userInfo._id;
  }
  console.log(clientToSocketIdMap);

  console.log('calling getLeaderInfo')
  getLeaderInfo();
  console.log('done getting leader info')
});

socket.on('get-history', (history) => {
  io.in(socket.room).emit('get-history', history);
  console.log('in get history')
  // console.log(leaderboardInfo)
  // io.in(socket.room).emit('leader-info', leaderboardInfo);
});

socket.on('roomCreated', (roomNoUserInfo) =>  {
  const userInfo = roomNoUserInfo.userInfo;
  let roomNo = roomNoUserInfo.roomNo;
  console.log("room created app side")
  console.log(roomNo);

  while (roomNo.toString() in allRooms) {
    roomNo = Math.floor((Math.random() * 100000) + 1);
  };

  socket.room = roomNo;
  socket.join(roomNo);
  game = initNewGame();
  game.clientToSocketIdMap = clientToSocketIdMap;
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
/*    console.log(allRooms[roomNo.toString()]);
    console.log(allRooms[roomNo.toString()].joinable);*/
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
      game.totalPlayers += 1;
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
      socket.room = roomNo;
      io.to(socket.room).emit('roomJoined', game, userInfo, socketid);
      io.to(socket.id).emit('only-to-joiner', game);
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
  game.activePlayerIndex = 0;
  game.gameStatus = 1; 
  game.activePlayer = game.playerOrder[0];
  game.deathOrder = []
  // game.activePlayerIndex = game.playerOrder[0];
  allRooms[roomNo.toString()].joinable = false;

  io.to(socket.room).emit('gameStartedGo', game);

});

socket.on("mousemove", (obj) => {
  console.log("in mousemove")
  console.log(obj.x)
  console.log(obj.y)
  io.to(socket.room).emit('mousemove', (obj));
});

socket.on("go-back-home", (home) => {
  io.to(socket.id).emit('go-back-home', home);
  socket.leave(game.roomNo);
  game = initNewGame()
  leaderboardInfo = [];
});

function historyFinder(err, history) {
  let longestWord = game.lastWords[0];
  for (let i in game.lastWords) {
    if (game.lastWords[i].length > longestWord.length) {
      longestWord = game.lastWords[i]
    }
  };
  if (err) {
        console.log('error');
      }
      else if (history === null) {
        let number_wins = 0;
        if (playerGoogleId === game.clientToSocketIdMap[game.indexMap[game.activePlayer]]) {
          number_wins += 1;
        }
        const newHistory = new History({
          'player_id': userGoogleInfo._id,
          'player_name': userGoogleInfo.name,
          'number_wins': number_wins,
          'number_games': 1,
          'longest_word': longestWord,
        });
        newHistory.save();
      }
      else {
        console.log("is this in the right order")
        let number_wins = 0;
        if (playerGoogleId === game.clientToSocketIdMap[game.indexMap[game.activePlayer]]) {
          console.log('winner')
          history.number_wins += 1;
        }
        history.number_games = history.number_games + 1;
        if (history.longest_word === undefined) {
          history.longest_word = longestWord;
        }
        else if (longestWord.length > history.longest_word.length) {
          history.longest_word = longestWord;
        };
        history.save();
      }
} 

const morePromises = [];

async function updateDatabaseHelper(player) {
    console.log('one loop in updateDatabase')
    console.log(player);
    playerGoogleId = game.clientToSocketIdMap[game.indexMap[player]];
    console.log(game.indexMap[player]);
    console.log(game.clientToSocketIdMap[game.indexMap[player]]);
    // console.log()
    console.log(playerGoogleId);
    console.log('winning person info')
    console.log(game.clientToSocketIdMap[game.indexMap[game.activePlayer]])
    return History.findOne({player_id: playerGoogleId}, async function(err, history) {
      let result = await historyFinder(err, history);
      return Promise.all(morePromises);
    });
};

const databasePromises = [];

async function updateDatabase() {
  console.log('updateDatabase');
  for (player in game.indexMap) {
    let result = await updateDatabaseHelper(player);
    // databasePromises.push(results);
  }
  return Promise.all(databasePromises);
}


getLeaderInfo = () => {
  leaderboardInfo = [];
  console.log('getLeaderInfo');
  History.find().sort({number_wins:-1}).limit(10).exec(function(err, result) {
    console.log('did it find')
    console.log(result);
    console.log('setting stuff');
    let rawLeaderInfo = result;
    for (let i in rawLeaderInfo) {
      leaderboardInfo.push([rawLeaderInfo[i].player_name, rawLeaderInfo[i].number_wins]);
    };
    console.log(leaderboardInfo);
    io.emit('leader-info', leaderboardInfo);
  });
}


  socket.on("disconnect", () => {
    console.log("a user dced");
    numConnected -= 1;
    if (numConnected === 0) {
      gameStarted = false;
    }
    console.log(socket.id + " disconnected")
    console.log(game.gameStatus)

    try {
        if (game.players && game.gameStatus === 1){
          game.activePlayer = (_.invert(game.indexMap))[socket.id].toString()
          game.players[socket.id].ghost = 4
          gameUpdate(game, '').then(() => {
            console.log(game)
            if (game.playerDeath) {
              io.in(socket.room).emit("player-death", game);
            }
            if (game.gameOver) {
              io.in(socket.room).emit("game-over", game);
              updateDatabase();
            }
            else {
              io.in(socket.room).emit("game-update", game);
              }
            })
        } else if (game.players && game.gameStatus === 0){
          game.activePlayer = (_.invert(game.indexMap))[socket.id].toString()
          console.log('inside game status 0')
          console.log(game.activePlayer)
          removePlayers(game, game.activePlayer)
          io.in(socket.room).emit("disconnect", game); 
        }
    } catch {
        console.log('user null error')
    }



  });
})

