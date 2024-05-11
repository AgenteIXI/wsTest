const webpush = require("web-push");
require("dotenv").config();

const subscriptions = new Map();
subscriptions.set("000", {
  name: "Admin",
  photo: "imgMostrar_000.png",
  code: "000",
});

webpush.setVapidDetails(
  "mailto:oliver@sysall.us",
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

module.exports = { webpush, subscriptions };
