const express = require("express");
const liveReload = require("livereload");
const http = require("http");
const connectLiveReload = require("connect-livereload");
const path = require("path");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const router = require("./routers/authRouter.cjs");
const mainRouter = require("./routers/mainRouter.cjs");
const dotenv = require("dotenv");

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

//reloading my browser if theres file changes
const liveServer = liveReload.createServer();
liveServer.watch(path.resolve("../chat/frontend"));

// adding middlewares to my server
app.use(connectLiveReload());
app.use(express.static(path.resolve("./frontend/public")));
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
