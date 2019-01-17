const express = require("express");
const path = require("path");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { initNewGame } = require("./game");

const publicPath = path.resolve(__dirname, "..", "client", "dist");


app.use(express.static(publicPath));

http.listen(3000, () => {
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

