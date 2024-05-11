const PUBLIC_VAPID_KEY =
  "BIIGZQLwPGPpn-l-0TaXKWRAsy-Fk-rNFSjtjwEJl3EVsEcSR07vYjBux5MxaFH8GXqPhndOUYZYJbsg_UJMIPM";

// const subscription = async () => {
//   const register = await navigator.serviceWorker.register("/worker.js", {
//     scope: "/",
//   });

//   console.log("Listening Push Notifications");
//   const subscription = await register.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: /*urlBase64ToUint8Array(*/ PUBLIC_VAPID_KEY /*)*/,
//   });

//   await fetch("/subscription", {
//     method: "POST",
//     body: JSON.stringify({
//       sub: subscription,
//       name: "Oliver",
//       photo: "img.png",
//       code: "032",
//     }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   console.log("Subscripted");
// };

const form = document.querySelector("#sendMessage");
const message = document.querySelector("#message");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/sendMessage", {
    method: "POST",
    body: JSON.stringify({ message: message.value, senderCode: '000', code: "032" }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  form.reset();
});

// subscription();
