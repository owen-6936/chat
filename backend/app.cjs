const express = require("express");
const liveReload = require("livereload");
const http = require("http");
const socketio = require("socket.io");
const connectLiveReload = require("connect-livereload");
const path = require("path");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const router = require("./routers/authRouter.cjs");
const mainRouter = require("./routers/mainRouter.cjs");
const dotenv = require("dotenv");
const { handleFindSocket } = require("./controllers/accController.cjs");
// defining variables
const app = express();
var port = 5500;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const uri =
  "mongodb://" +
  username +
  ":" +
  password +
  "@cluster0-shard-00-00.x6hia.mongodb.net:27017,cluster0-shard-00-01.x6hia.mongodb.net:27017,cluster0-shard-00-02.x6hia.mongodb.net:27017/?ssl=true&replicaSet=atlas-sw0m8q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
const store = new mongoDBStore({ uri, collection: "mySessions" });
dotenv.config();

// creating the server
const server = http.createServer(app);
const io = new socketio.Server(server);

io.use(async (socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    next(new Error("invalid username"));
  }
  socket.username = username;
  const sock = await handleFindSocket({ username });
  if (sock) {
    socket.sid = sock.sid;
    socket.uid = sock.uid;
  } else {
    console.error("your socket object could not be found!");
  }
  next();
});

io.on("connection", (socket) => {
  const users = [];
  socket.join(socket.sid);
  io.of("/").sockets.forEach((socket) => {
    const user = {
      uid: socket.uid,
      sid: socket.sid,
      username: socket.username,
    };
    users.push(user);
  });
  io.emit("users", users);
  socket.broadcast.emit("user connected", {
    sid: socket.id,
    username: socket.username,
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", {
      sid: socket.id,
      username: socket.username,
    });
  });
  socket.on("private message", (selectedUser) => {
    selectedUser.from.uid = socket.uid;
    io.to(selectedUser.sid).to(socket.sid).emit("new message", selectedUser);
  });
  socket.on("new message", (obj) => {
    if (socket.uid === obj.from.uid) {
      var newMessageObj = Object.assign(
        {
          username: obj.from._username,
          uid: obj.from.uid,
          otherUid: obj.uid,
          message: {
            mid: obj.mid,
            sender: true,
            message: obj.message,
          },
        },
        {}
      );
    } else {
      newMessageObj = Object.assign(
        {
          username: obj.to,
          uid: obj.uid,
          otherUid: obj.from.uid,
          message: {
            mid: obj.mid,
            sender: false,
            message: obj.message,
          },
        },
        {}
      );
    }
    console.log(newMessageObj, socket.username);
  });
});

//reloading my browser if theres file changes
const liveServer = liveReload.createServer();
liveServer.watch(path.resolve("../chat/frontend"));

// adding middlewares to my server
app.use(connectLiveReload());
app.use(express.static(path.resolve("./frontend/public")));
app.use(express.static(path.resolve("./")));
app.use(express.static(path.resolve("./node_modules")));
app.use(express.static(path.resolve("./node_modules/socket.io/client-dist")));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);
app.use("/", router);
app.use("/", mainRouter);

server.listen(port, () => {
  console.log(`express application running on port ${port}`);
});
