const express = require("express");
const controller = require("./slots.controller");

const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");

const router = express.Router();

// PUBLIC : voir les créneaux d’une salle
router.get("/rooms/:roomId/slots", controller.listByRoom);

// ADMIN : créer un créneau pour une salle
router.post("/rooms/:roomId/slots", auth, admin, controller.createForRoom);

module.exports = router;
