const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const _ = require("lodash");
const basicAuth = require("../middleware/basicAuth");
const jwtAuth = require("../middleware/jwtAuth");

router.post("/register", basicAuth, authController.register);
router.post("/login", basicAuth, authController.login);
router.post("/confirmemail", basicAuth, authController.confirmEmail);
router.get("/currentUser", jwtAuth, authController.getCurrentUser);
router.post("/resetPassword", authController.resetPassword);
router.post("/updatePassword", authController.updatePassword);

module.exports = router;
