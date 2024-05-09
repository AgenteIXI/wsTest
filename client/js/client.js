const socket = new WebSocket("ws://localhost:3000"); // Reemplaza localhost con la dirección del servidor si es necesario

socket.addEventListener("open", () => {
  const clientCode = "032";
  const clientName = "Oliver Delgado";
  const clientImg = "USU_032_20240424120652.png";
  socket.send(JSON.stringify({ code: clientCode, name: clientName, photo: clientImg }));
});

socket.addEventListener("message", (e) => {
  const mensaje = JSON.parse(e.data); // Parsea el mensaje JSON recibido
  const mensajeTexto = mensaje.message; // Obtiene el texto del mensaje

  // Muestra el mensaje en la interfaz de usuario
  mostrarMensajeEnInterfaz(mensajeTexto);

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
