document.addEventListener("DOMContentLoaded", (e) => {
  let popup = document.querySelector(".active_noti");
  if (Notification.permission === "granted") {
    popup.remove();
    console.log("Las notificaciones están activas.");
  } else if (Notification.permission === "denied") {
    console.log(
      "Las notificaciones están desactivadas. El usuario ha denegado el permiso."
    );
  } else {
    popup.classList.add("show");
    console.log("Solicitando permiso para notificaciones...");

    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        console.log("Permiso concedido.");
      } else {
        console.log("Permiso denegado.");
      }
    });
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./worker.js")
    .then(function (registration) {
      console.log(
        "Service Worker registrado con éxito con scope:",
        registration.scope
      );
    })
    .catch(function (error) {
      console.log("Registro de Service Worker fallido:", error);
    });
}

function activeNoti() {
  Notification.requestPermission().then(function (permission) {
    if (permission === "granted") {
      console.log("Permiso de notificaciones concedido");
    } else {
      console.log("Permiso de notificaciones denegado");
    }
  });
}
