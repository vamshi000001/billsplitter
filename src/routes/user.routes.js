const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(authMiddleware);

router.put("/profile", userController.updateProfile);
router.put("/password", userController.changePassword);

module.exports = router;
