const express = require("express");
const controller = require("./reservations.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

// User connecté : réserver
router.post("/reservations", auth, controller.create);

// User connecté : mes réservations
router.get("/reservations/me", auth, controller.mine);

router.delete("/reservations/:id", auth, controller.cancel);

module.exports = router;
