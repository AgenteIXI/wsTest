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

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0]; // Tomamos la primera IP si hay varias.
  }
  return req.connection.remoteAddress;
}


module.exports = { applyMiddleware, getLocationByIP, getClientIp };
