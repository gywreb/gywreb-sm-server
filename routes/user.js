const express = require("express");
const jwtAuth = require("../middleware/jwtAuth");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/", jwtAuth, userController.getAllUser);

module.exports = router;
