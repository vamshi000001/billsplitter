const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/login/room", authController.loginRoommate);
router.post("/accept-invite", authController.acceptInvite);

module.exports = router;
