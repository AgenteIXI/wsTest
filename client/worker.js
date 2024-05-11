self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log(data);

  self.registration.showNotification(data.title, {
    body: data.message,
    icon: "https://media.sysallpro.com//img/usuario_admin/" + data.photo,
  });
});
