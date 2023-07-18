const express = require("express");
const router = express.Router();

const home = require("./modules/home");
const records = require("./modules/records");
const users = require("./modules/users");

// const { authenticator } = require("../middleware/auth");

// router.use("/restaurants", authenticator, restaurants);
// router.use("/users", users);
// router.use("/auth", auth);
router.use("/users", users);
router.use("/records", records);
router.use("/", home);

module.exports = router;
