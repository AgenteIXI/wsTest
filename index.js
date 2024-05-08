const express = require("express");
const app = express();
const server = require("http").createServer(app);
const websocket = require("ws");
const path = require("path");
const cors = require("cors"); // Importa el middleware de CORS

app.use(cors());
const wss = new websocket.Server({ server: server });
const clients = new Map(); // Mapeo de códigos de cliente a conexiones WebSocket

wss.on("connection", function connection(ws) {
  console.log("Nuevo cliente conectado");

  ws.on("message", function incoming(message) {
    // Parsea el mensaje JSON recibido
    const data = JSON.parse(message);

    // Asocia el código de cliente con la conexión WebSocket
    clients.set(data.code, ws);

    console.log(`Cliente con código ${data.code} asociado a esta conexión`);
  });

  ws.on("close", function close() {
    console.log("Cliente desconectado");

    // Remueve la entrada del cliente del mapeo al desconectarse
    clients.forEach((client, code) => {
      if (client === ws) {
        console.log(`Cliente con código ${code} desconectado`);
        clients.delete(code);
      }
    });
  });
});

app.post("/send", express.json(), (req, res) => {
  const { code, message } = req.body;
  console.log(code);
  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  if (code === '-1') {
    // Envía el mensaje a todos los clientes
    wss.clients.forEach(client => {
      client.send(JSON.stringify({ message }));
    });
    return res.status(200).json({ success: true });
  } else {
    const client = clients.get(code);
    if (client) {
      client.send(JSON.stringify({ message }));
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ error: `Client ${code} not found` }); // Envie el code como debug inspect
    }
  }
});


app.get("/", (req, res) => {
  // Enviar el archivo client/index.html como respuesta
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Servir archivos estáticos desde el directorio 'client'
app.use(express.static(path.join(__dirname, "client")));

server.listen(3000, () => console.log("Listen on port: 3000"));
