const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { getLocationByIP } = require("../middlewares/middlewares.js");

const clients = new Map();

function handleWebSocketConnection(ws, req) {
  const clientIp = req.connection.remoteAddress;

  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);
    const uniqueId = uuidv4(); // Generar un UUID único
    const currentTime = moment();
    clients.set(uniqueId, {
      id: uniqueId, // Usamos el UUID como ID único
      code: data.code,
      name: data.name,
      photo: data.photo,
      version: data.version,
      where: data.where,
      lastAccessTimestamp: currentTime,
      ip: clientIp,
      location: getLocationByIP(clientIp),
      ws: ws,
    });
    console.log(
      `Cliente con ${data.code} asociado a esta conexión con ID ${uniqueId} desde la IP ${clientIp}`
    );
  });

  ws.on("close", function close() {
    clients.forEach((clientInfo, code) => {
      if (clientInfo.ws === ws) {
        console.log(`Cliente con código ${code} desconectado`);
        clients.delete(code);
      }
    });
  });
}

module.exports = {
  handleWebSocketConnection,
  clients
};
