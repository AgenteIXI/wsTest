const path = require("path");
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
    clients.set(uniqueId, {
      name: data.name,
      photo: data.photo,
      code: data.code,
      id: uniqueId, // Usamos el UUID como ID único
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

function home(req, res) {
  // Envía el archivo index.html como respuesta
  res.sendFile(path.join(__dirname, "client", "index.html"));
}

function sendMessage(req, res) {
  const { code, message, senderCode } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  if (!senderCode) {
    return res.status(400).json({ error: "Missing sender code" });
  }

  const sender = clients.get(senderCode);

  if (!sender) {
    return res.status(404).json({ error: `Sender ${senderCode} not found` });
  }

  if (code === "-1") {
    clients.forEach((client, clientId) => {
      client.ws.send(
        JSON.stringify({ name: sender.name, photo: sender.photo, message })
      );
    });
  } else {
    clients.forEach((client, clientId) => {
      if (client.code === code) {
        client.ws.send(
          JSON.stringify({ name: sender.name, photo: sender.photo, message })
        );
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

  const sanitizedClients = activeClientsArray.map((client) => {
    const { ws, ...sanitizedClient } = client;
    return sanitizedClient;
  });

  res.json(sanitizedClients);
}

module.exports = {
  handleWebSocketConnection,
  home,
  sendMessage,
  getActiveClients,
};
