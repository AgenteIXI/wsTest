const express = require("express");
const http = require("http");
const path = require("path");
const { applyMiddleware } = require("./middlewares/middlewares");
const { applyRoutes } = require("./router");
const { applyWebSocketServer } = require("./server/websocketServer");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "client")));

applyMiddleware(app);
applyRoutes(app);
applyWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
