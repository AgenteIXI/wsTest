const express = require("express");
const app = express();
const server = require("http").createServer(app);
const websocket = require("ws");
const path = require("path");

const wss = new websocket.Server({ server: server });

wss.on("connection", function connection(ws) {
  console.log("Nuevo cliente conectado");

  // Envía una notificación al cliente cada 5 segundos
  const interval = setInterval(() => {
    ws.send("¡Hola! ¡Has recibido una notificación!");
  }, 5000);

  ws.on("close", function close() {
    console.log("Cliente desconectado");
    clearInterval(interval); // Detiene el intervalo cuando el cliente se desconecta
  });
});

app.get("/", (req, res) => {
  // Enviar el archivo client/index.html como respuesta
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Servir archivos estáticos desde el directorio 'client'
app.use(express.static(path.join(__dirname, "client")));

server.listen(3000, () => console.log("Listen on port: 3000"));
