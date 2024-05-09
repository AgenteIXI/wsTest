const express = require("express");
const { getActiveClients, sendMessage, home } = require("../controller/controllers");


function applyRoutes(app) {
  const router = express.Router();

  router.get("/", home);
  router.post("/send", sendMessage);
  // router.get("/get", getActiveClients);

  app.use(router);
}

module.exports = { applyRoutes };
