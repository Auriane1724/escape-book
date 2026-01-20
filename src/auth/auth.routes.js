const express = require("express");
const controller = require("./auth.controller");

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);

const authMiddleware = require("../middlewares/auth.middleware");
router.get("/me", authMiddleware, controller.me);

module.exports = router;
