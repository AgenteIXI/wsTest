const { Router } = require("express");
const router = Router();

const {
  addSubscription,
  sendMessage,
  getSubscription
} = require("../controller/messagePushController.js");

router.get("/getSub", getSubscription)
router.post("/subscription", addSubscription);
router.post("/sendMessage", sendMessage);

module.exports = { router };
