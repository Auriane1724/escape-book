const express = require("express");
const controller = require("./rooms.controller");

const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");

const router = express.Router();

// Public
router.get("/", controller.list);
router.get("/:id", controller.get);

// Admin
router.post("/", auth, admin, controller.create);
router.put("/:id", auth, admin, controller.update);
router.delete("/:id", auth, admin, controller.remove);

module.exports = router;
