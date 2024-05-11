const websocket = require("ws");
const { handleWebSocketConnection } = require("../controller/websocketController.js");

function applyWebSocketServer(server) {
  const wss = new websocket.Server({ server });

  wss.on("connection", handleWebSocketConnection);

  wss.on("listening", () => {
    const path = wss.options.path || ''; // Verifica si wss.options.path existe, de lo contrario, establece una cadena vacía
    console.log(`WebSocket Server running at ws://${server.address().address}:${server.address().port}${path}`);
  });
}

module.exports = { applyWebSocketServer };
