const { Router } = require("express");
const router = Router();

const { webpush } = require("../controller/webpushController.js");
let pushSubscription;

router.post("/subscription", async (req, res) => {
  pushSubscription = req.body;
  res.status(200).json({ name: "test" });

  const payload = JSON.stringify({
    title: "New Notification",
    message: "Hello World",
  });
  try {
    await webpush.sendNotification(pushSubscription, payload);
  } catch (error) {
    console.error(error);
  }
});

module.exports = { router };
