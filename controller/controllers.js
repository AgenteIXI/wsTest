const path = require("path");
const clients = new Map();

function handleWebSocketConnection(ws) {
  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);
    clients.set(data.code, {
      name: data.name,
      foto: data.photo,
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
  const { code, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  if (code === "-1") {
    // Si el código es -1, envía el mensaje a todos los clientes conectados
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ message }));
    });
    return res.status(200).json({ success: true });
  } else {
    // Si el código no es -1, busca al cliente correspondiente y envía el mensaje solo a ese cliente
    const client = clients.get(code);
    if (client) {
      client.ws.send(JSON.stringify({ message }));
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ error: `Client ${code} not found` });
    }
  }
}

function getActiveClients(req, res) {
  const activeClientsArray = Array.from(clients.values());

  const sanitizedClients = activeClientsArray.map(client => {
    const { ws, ...sanitizedClient } = client;
    return sanitizedClient;
  });

  res.json(sanitizedClients);
}


module.exports = { handleWebSocketConnection, home, sendMessage, getActiveClients };
