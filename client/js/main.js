const PUBLIC_VAPID_KEY = "BIIGZQLwPGPpn-l-0TaXKWRAsy-Fk-rNFSjtjwEJl3EVsEcSR07vYjBux5MxaFH8GXqPhndOUYZYJbsg_UJMIPM";

const subscription = async () => {
  const register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/",
  });

  console.log("Listening Push Notifications");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
  });

  await fetch("/subscription", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Subscripted");
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

subscription();
