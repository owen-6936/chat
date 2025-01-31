const express = require("express");
const liveReload = require("livereload");
const http = require("http");
const connectLiveReload = require("connect-livereload");
const path = require("path");
const router = require("./routers/authRouter.cjs");
const app = express();
var port = 5500;
const server = http.createServer(app);
const liveServer = liveReload.createServer();
liveServer.watch(path.resolve("../chat/frontend"));
app.use(connectLiveReload());
app.use(express.static(path.resolve("./frontend/public")));
app.use(express.json());

app.use("/", router);

server.listen(port, () => {
  console.log(`express application running on port ${port}`);
});
