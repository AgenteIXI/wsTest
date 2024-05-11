const { webpush, subscriptions } = require("./webpushController.js");
const moment = require("moment");

const { v4: uuidv4 } = require("uuid");
const { getLocationByIP } = require("../middlewares/middlewares.js");

async function addSubscription(req, res) {
  const data = req.body;
  const clientIp = req.connection.remoteAddress;

  const uniqueId = uuidv4();
  const currentTime = moment();
  subscriptions.set(uniqueId, {
    id: uniqueId,
    code: data.code,
    name: data.name,
    photo: data.photo,
    version: data.version,
    where: data.where,
    lastAccessTimestamp: currentTime,
    ip: clientIp,
    location: getLocationByIP(clientIp),
    subscription: data.sub,
  });
  console.log(
    `Subscriptor con ${data.code} asociado a esta conexión con ID ${uniqueId} desde la IP ${clientIp}`
  );

  res
    .status(200)
    .json({ success: true, message: "Subscription saved successfully." });
}

async function sendMessage(req, res) {
  const { code, message, senderCode } = req.body;

  let sender;
  // Asumiendo que subscriptions es un Map
  for (const subscription of subscriptions.values()) {
    if (subscription.code === senderCode) {
      sender = subscription;
      break;
    }
  }

  if (!sender) {
    return res.status(404).json({ error: `Sender ${senderCode} not found` });
  }

  const payload = JSON.stringify({
    title: sender.name,
    message: message,
    photo: sender.photo,
  });

  try {
    let targetedSubscriptions;

    if (code === "-1") {
      targetedSubscriptions = [...subscriptions.values()];
    } else if (code.includes(",")) {
      const codes = code.split(",");
      targetedSubscriptions = Array.from(subscriptions.values()).filter((sub) =>
        codes.includes(sub.code)
      );
    } else {
      targetedSubscriptions = Array.from(subscriptions.values()).filter(
        (sub) => sub.code === code
      );
    }

    const notificationPromises = targetedSubscriptions.map((sub) => {
      if (!sub.subscription || !sub.subscription.endpoint) {
        console.error(`Invalid subscription detected, removing: `, sub);
        // Aquí podrías eliminar la suscripción o marcarla como inactiva
        subscriptions.delete(sub.id); // Suponiendo que 'id' es la clave para identificar y eliminar una suscripción del Map
        return Promise.resolve();
      }
      return webpush
        .sendNotification(sub.subscription, payload)
        .catch((error) => {
          if (error.statusCode === 410) {
            console.error(
              `Subscription has expired or unsubscribed, removing: `,
              sub
            );
            // Elimina o actualiza la suscripción aquí también.
            subscriptions.delete(sub.id);
          } else {
            console.error(`Failed to send notification: `, error);
          }
        });
    });

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
}

function getSubscription(req, res) {
  const activesubscriptionsArray = Array.from(subscriptions.values());

  if (activesubscriptionsArray.length === 0) {
    return res.json("empty");
  }

  const subscriptionsMap = new Map();

  activesubscriptionsArray.forEach((client) => {
    if (subscriptionsMap.has(client.code)) {
      const existingClient = subscriptionsMap.get(client.code);
      existingClient.SESSION.push({
        id: client.id,
        where: client.where,
        version: client.version,
        ip: client.ip,
        location: client.location,
        lastAccessTimestamp: client.lastAccessTimestamp,
        lastAccess: moment(client.lastAccessTimestamp).fromNow(), // Convertir el timestamp a tiempo relativo usando Moment.js
      });
    } else {
      // Si no existe, creamos un nuevo objeto de cliente y lo agregamos al mapa
      const newClient = {
        code: client.code,
        name: client.name,
        photo: client.photo,
        SESSION: [
          {
            id: client.id,
            where: client.where,
            version: client.version,
            ip: client.ip,
            location: client.location,
            lastAccessTimestamp: client.lastAccessTimestamp,
            lastAccess: moment(client.lastAccessTimestamp).fromNow(), // Convertir el timestamp a tiempo relativo usando Moment.js
          },
        ],
      };
      subscriptionsMap.set(client.code, newClient);
    }
  });

  const sanitizedsubscriptions = Array.from(subscriptionsMap.values());

  res.json(sanitizedsubscriptions);
}

module.exports = { addSubscription, sendMessage, getSubscription };
