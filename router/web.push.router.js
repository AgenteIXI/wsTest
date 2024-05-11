const { Router } = require("express");
const router = Router();

const { webpush } = require("../controller/webpushController.js");
let subscriptions = []; // Usar un arreglo para almacenar todas las suscripciones

router.post("/subscription", async (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription); // Agregar la nueva suscripción al arreglo
  res
    .status(200)
    .json({ success: true, message: "Subscription saved successfully." });
});

router.post("/sendMessage", async (req, res) => {
  const { message } = req.body;

  const payload = JSON.stringify({
    title: "New Notification",
    message: message,
  });

  try {
    // Enviar notificación a todas las suscripciones almacenadas
    const notificationPromises = subscriptions.map((sub) =>
      webpush.sendNotification(sub, payload)
    );
    await Promise.all(notificationPromises);

    res
      .status(200)
      .json({ success: true, message: "Notifications sent successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send notifications." });
  }
});

module.exports = { router };
