const socket = new WebSocket("ws://localhost:3000"); // Reemplaza localhost con la dirección del servidor si es necesario
BASE_REL = "http"
socket.addEventListener("open", () => {
  const clientCode = code;
  const clientName = "Admin";
  const clientImg = "imgMostrar_000.png";
  socket.send(
    JSON.stringify({
      code: clientCode,
      name: clientName,
      photo: clientImg,
      where: location.href.replace(BASE_REL, ""),
      version: 1,
    })
  );
});

socket.addEventListener("message", (e) => {
  const data = JSON.parse(e.data); // Parsea el mensaje JSON recibido
  const mensajeTexto = data.message; // Obtiene el texto del mensaje
  console.log(data);

  mostrarNotificacion(mensajeTexto);
});

function mostrarMensajeEnInterfaz(mensaje) {
  // const listaMensajes = document.getElementById("messages");
  // const nuevoMensaje = document.createElement("li");
  // nuevoMensaje.textContent = mensaje;
  // listaMensajes.appendChild(nuevoMensaje);
  console.log(mensaje);
}

function mostrarNotificacion(mensaje) {
  alert(mensaje);
}
