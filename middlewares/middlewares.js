const express = require("express");
const cors = require("cors");
const geoip = require("geoip-lite");

function applyMiddleware(app) {
  app.use(express.json());
  app.use(cors());
}

function getLocationByIP(ip) {
  const geo = geoip.lookup(ip);
  return geo;
}

module.exports = { applyMiddleware, getLocationByIP };
