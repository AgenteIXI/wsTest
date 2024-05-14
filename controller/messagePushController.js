const { webpush } = require("./webpushController.js");
const moment = require("moment");

const fs = require("fs");
const path = require("path");

const { v4: uuidv4 } = require("uuid");
const {
  getLocationByIP,
  getClientIp,
} = require("../middlewares/middlewares.js");

async function addSubscription(req, res) {
  const data = req.body;
  const clientIp = getClientIp(req);
  const uniqueId = uuidv4();
  const currentTime = moment();
  const subscriptionData = {
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
  };

  const subscriptionsDir = path.join(__dirname, "../data");
  const subscriptionsFile = path.join(subscriptionsDir, "subscriptions.json");

  // Asegúrate de que la carpeta 'data' exista
  if (!fs.existsSync(subscriptionsDir)) {
    fs.mkdirSync(subscriptionsDir);
    console.log("Created 'data' directory");
  }

  let existingSubscriptions = [];
  // Verifica si el archivo existe
  if (fs.existsSync(subscriptionsFile)) {
    console.log("Reading existing subscriptions from file.");
    existingSubscriptions = JSON.parse(
      fs.readFileSync(subscriptionsFile, "utf8")
    );
  }

  existingSubscriptions.push(subscriptionData);
  try {
    fs.writeFileSync(
      subscriptionsFile,
      JSON.stringify(existingSubscriptions, null, 2),
      "utf8"
    );
    console.log("Subscription data saved successfully.");
  } catch (error) {
    console.error("Error writing to file:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to save subscription data." });
    return;
  }

  console.log(
    `Subscriber with code ${data.code} associated with connection ID ${uniqueId} from IP ${clientIp}`
  );
  res.status(200).json({
    success: true,
    message: "Subscription saved successfully.",
    codeRegister: uniqueId,
  });
}

async function sendMessage(req, res) {
  const { code, message, senderCode } = req.body;
  const subscriptionsFile = path.join(
    __dirname,
    "../data",
    "subscriptions.json"
  );
  let subscriptions = [];

  if (fs.existsSync(subscriptionsFile)) {
    subscriptions = JSON.parse(fs.readFileSync(subscriptionsFile, "utf8"));
  }

  let sender = subscriptions.find((sub) => sub.code === senderCode);
  if (!sender) {
    return res.status(404).json({ error: `Sender ${senderCode} not found` });
  }

  let targetedSubscriptions = [];
  if (code === "-1") {
    targetedSubscriptions = subscriptions;
  } else if (code.includes(",")) {
    const codes = code.split(",");
    targetedSubscriptions = subscriptions.filter((sub) =>
      codes.includes(sub.code)
    );
  } else {
    targetedSubscriptions = subscriptions.filter((sub) => sub.code === code);
  }

  const notificationPromises = targetedSubscriptions.map((sub) => {
    const personalizedPayload = JSON.stringify({
      title: sender.name,
      message: message,
      photo: sender.photo,
      for: sub.code,
      to: sender.code,
    });

    return webpush
      .sendNotification(sub.subscription, personalizedPayload)
      .catch((error) => {
        console.error(`Failed to send notification: `, error);
      });
  });

  await Promise.all(notificationPromises);
  res
    .status(200)
    .json({ success: true, message: "Notifications sent successfully!" });
}

function getSubscription(req, res) {
  const subscriptionsFile = path.join(
    __dirname,
    "../data",
    "subscriptions.json"
  );
  let subscriptions = [];

  if (fs.existsSync(subscriptionsFile)) {
    subscriptions = JSON.parse(fs.readFileSync(subscriptionsFile, "utf8"));
  }

  if (subscriptions.length === 0) {
    return res.json({ message: "No active subscriptions" });
  }

  const sanitizedSubscriptions = subscriptions.map((sub) => ({
    code: sub.code,
    name: sub.name,
    sessions: [
      {
        id: sub.id,
        where: sub.where,
        version: sub.version,
        ip: sub.ip,
        location: sub.location,
        lastAccessTimestamp: sub.lastAccessTimestamp,
        lastAccess: moment(sub.lastAccessTimestamp).fromNow(),
      },
    ],
  }));

  res.json(sanitizedSubscriptions);
}

module.exports = { addSubscription, sendMessage, getSubscription };
