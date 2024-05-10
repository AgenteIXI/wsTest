const moment = require("moment");
require("moment/locale/es"); // Cargar el idioma español
const { v4: uuidv4 } = require("uuid");
const clients = new Map();
clients.set("000", {
  name: "admin",
  photo: "imgMostrar_000.png",
  code: "000",
});

function handleWebSocketConnection(ws) {
  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);
    const uniqueId = uuidv4(); // Genera un UUID único
    const currentTime = moment();
    moment.locale("es");
    clients.set(uniqueId, {
      id: uniqueId, // Usamos el UUID como ID único
      code: data.code,
      name: data.name,
      photo: data.photo,
      version: data.version,
      where: data.where,
      lastAccessTimestamp: currentTime, // Añade la fecha y hora actual al objeto
      lastAccess: currentTime.fromNow(), // Añade la fecha y hora actual en formato "timeAgo"
      ws: ws,
    });
    console.log(
      `Cliente con ${data.code} asociado a esta conexión con ID ${uniqueId}`
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

function sendMessage(req, res) {
  const { code, message, senderCode } = req.body;

  if (!message || !senderCode) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let sender;
  for (const client of clients.values()) {
    if (client.code === senderCode) {
      sender = client;
      break;
    }
  }

  if (!sender) {
    return res.status(404).json({ error: `Sender ${senderCode} not found` });
  }

  function sendMessageToClient(client) {
    client.ws.send(
      JSON.stringify({ name: sender.name, photo: sender.photo, message })
    );
  }

  if (code === "-1") {
    clients.forEach((client) => {
      if (client.ws && client.code !== senderCode) {
        sendMessageToClient(client);
      }
    });
  } else if (code.includes(",")) {
    const codeArray = code.split(",").map((c) => c.trim());
    codeArray.forEach((codeItem) => {
      clients.forEach((client) => {
        if (client.code === codeItem) {
          sendMessageToClient(client);
        }
      });
    });
  } else {
    clients.forEach((client) => {
      if (client && client.ws && client.code == code) {
        sendMessageToClient(client);
      }
    });
  }

  return res.status(200).json({ success: true });
}

function getActiveClients(req, res) {
  const activeClientsArray = Array.from(clients.values());

  if (activeClientsArray.length === 0) {
    return res.json("empty");
  }

  const clientsMap = new Map();

  activeClientsArray.forEach((client) => {
    if (clientsMap.has(client.code)) {
      const existingClient = clientsMap.get(client.code);
      existingClient.SESSION.push({
        id: client.id,
        where: client.where,
        version: client.version,
        lastAccessTimestamp: client.lastAccessTimestamp,
        lastAccess: moment(client.lastAccessTimestamp).fromNow(), // Convertir el timestamp a tiempo relativo usando Moment.js
      });
    } else {
      // Si no existe, creamos un nuevo objeto de cliente y lo agregamos al mapa
      const newClient = {
        code: client.code,
        name: client.name,
        photo: client.photo,
        SESSION: [
          {
            id: client.id,
            where: client.where,
            version: client.version,
            lastAccessTimestamp: client.lastAccessTimestamp,
            lastAccess: moment(client.lastAccessTimestamp).fromNow(), // Convertir el timestamp a tiempo relativo usando Moment.js
          },
        ],
      };
      clientsMap.set(client.code, newClient);
    }
  });

  const sanitizedClients = Array.from(clientsMap.values());

  res.json(sanitizedClients);
}

module.exports = {
  handleWebSocketConnection,
  // home,
  sendMessage,
  getActiveClients,
};
