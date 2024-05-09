const socket = new WebSocket("ws://localhost:3000"); // Reemplaza localhost con la dirección del servidor si es necesario

socket.addEventListener("open", () => {
  const clientCode = "000";
  const clientName = "Admin";
  const clientImg = "imgMostrar_000.png";
  socket.send(
    JSON.stringify({ code: clientCode, name: clientName, photo: clientImg })
  );
});

socket.addEventListener("message", (e) => {
  const data = JSON.parse(e.data); // Parsea el mensaje JSON recibido
  const mensajeTexto = data.message; // Obtiene el texto del mensaje
  console.log(data);
  // Muestra el mensaje en la interfaz de usuario
  // mostrarMensajeEnInterfaz(mensajeTexto);

  // Aquí puedes mostrar la notificación al usuario si las notificaciones están habilitadas
  if (notificationsEnabled) {
    mostrarNotificacion(mensajeTexto);
  }
});

function mostrarMensajeEnInterfaz(mensaje) {
  // const listaMensajes = document.getElementById("messages");
  // const nuevoMensaje = document.createElement("li");
  // nuevoMensaje.textContent = mensaje;
  // listaMensajes.appendChild(nuevoMensaje);
  console.log(mensaje);
}
