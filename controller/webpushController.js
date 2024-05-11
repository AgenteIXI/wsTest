const webpush = require("web-push");
require("dotenv").config();

const vapidKeys = webpush.generateVAPIDKeys();

// Prints 2 URL Safe Base64 Encoded Strings
console.log({
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey
});

webpush.setVapidDetails(
  "mailto:oliver@sysall.us",
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

module.exports = { webpush };
