const { Router } = require("express");
const router = Router();

const webpush = require("../controller/webpushController.js");

router.post("/subscription", (req, res) => {
  console.log(req.body);
  res.status(200).json({ name: "test" });
});

module.exports = { router };
