require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");

const morgan = require("morgan");

const { applyMiddleware } = require("./middlewares/middlewares");
const { applyRoutes } = require("./router/socker.router.js");

const { router } = require("./router/web.push.router.js");

const { applyWebSocketServer } = require("./server/websocketServer");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "client")));

applyMiddleware(app);
applyRoutes(app);
applyWebSocketServer(server);

app.use(router)

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
