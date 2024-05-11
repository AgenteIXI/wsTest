self.addEventListener('push', e => {
    const data = e.data.json()
    console.log(data);
    console.log("New Notifiation");
})