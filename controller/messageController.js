const { clients } = require("./websocketController");

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
        ip: client.ip,
        location: client.location,
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
            ip: client.ip,
            location: client.location,
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
  sendMessage,
  getActiveClients,
};
