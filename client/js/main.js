const PUBLIC_VAPID_KEY = "BIIGZQLwPGPpn-l-0TaXKWRAsy-Fk-rNFSjtjwEJl3EVsEcSR07vYjBux5MxaFH8GXqPhndOUYZYJbsg_UJMIPM";

const subscription = async () => {
  const register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/",
  });

  console.log("Listening Push Notifications");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: /*urlBase64ToUint8Array(*/PUBLIC_VAPID_KEY/*)*/,
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

subscription();
