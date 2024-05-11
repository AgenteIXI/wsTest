const PUBLIC_VAPID_KEY =
  "BIIGZQLwPGPpn-l-0TaXKWRAsy-Fk-rNFSjtjwEJl3EVsEcSR07vYjBux5MxaFH8GXqPhndOUYZYJbsg_UJMIPM";

const subscription = async () => {
  // Verifica si ya existe un Service Worker registrado
  let existingRegistration = await navigator.serviceWorker.getRegistration();
  if (existingRegistration) {
    // Si existe, lo desregistra
    await existingRegistration.unregister();
    console.log("Existing Service Worker unregistered");
  }

  // Registra el nuevo Service Worker
  const register = await navigator.serviceWorker.register("/worker.js");
  console.log("New Service Worker registered", register.scope);

  // Escucha notificaciones push
  console.log("Listening for Push Notifications");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: /*urlBase64ToUint8Array(*/ PUBLIC_VAPID_KEY /*)*/,
  });

  // Envía la suscripción al servidor
  await fetch("/subscription", {
    method: "POST",
    body: JSON.stringify({
      sub: subscription,
      name: "Oliver",
      photo: "img.png",
      code: "032",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Subscribed");
};

const form = document.querySelector("#sendMessage");
const message = document.querySelector("#message");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/sendMessage", {
    method: "POST",
    body: JSON.stringify({
      message: message.value,
      senderCode: "000",
      code: "032",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  form.reset();
});

subscription();
