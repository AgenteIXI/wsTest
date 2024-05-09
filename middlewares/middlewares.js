const express = require("express");
const cors = require("cors");

function applyMiddleware(app) {
  app.use(express.json());
  app.use(cors());
}

module.exports = { applyMiddleware };
