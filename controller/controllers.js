const path = require("path");
const clients = new Map();

function handleWebSocketConnection(ws) {
  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);
    clients.set(data.code, {
      name: data.name,
      photo: data.photo,
      code: data.code,
      ws: ws,
    });
    console.log(`Cliente con código ${data.code} asociado a esta conexión`);
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

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  const sender = clients.get(senderCode);
  if (code === "-1") {
    clients.forEach((client, clientCode) => {
      client.ws.send(
        JSON.stringify({ name: sender.name, photo: sender.photo, message })
      );
    });

    return res.status(200).json({ success: true });
  }

  // Verificar si el cliente está conectado
  const client = clients.get(code);
  if (!client) {
    return res.status(404).json({ error: `Client ${code} not found` });
  }

  // Envía el mensaje al cliente incluyendo el código del remitente
  client.ws.send(
    JSON.stringify({ name: sender.name, photo: sender.photo, message })
  );
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
