require("dotenv").config();
console.log("DB_USER =", process.env.DB_USER);

const express = require("express");
const cors = require("cors");
const roomsRoutes = require("./rooms/rooms.routes");
const slotsRoutes = require("./slots/slots.routes");
const reservationsRoutes = require("./reservations/reservations.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", slotsRoutes);
app.use("/api", reservationsRoutes);

console.log("✅ app.js chargé (src/app.js)");

// Test serveur
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "EscapeBook API is running",
    app: "src/app.js",
  });
});

// Routes auth
const authRoutes = require("./auth/auth.routes");
app.use("/api/auth", authRoutes);

// Route de check
app.get("/api/routes-check", (req, res) => {
  res.json({
    status: "ok",
    routes: [
      "GET /api/health",
      "GET /api/routes-check",
      "POST /api/auth/register",
      "POST /api/auth/login",
    ],
  });
});
app.use("/api/rooms", roomsRoutes);

module.exports = app;
