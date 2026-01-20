const service = require("./reservations.service");

async function create(req, res) {
  try {
    const reservation = await service.createReservation({
      userId: req.user.id,
      slot_id: req.body.slot_id,
      players_count: req.body.players_count,
    });
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function mine(req, res) {
  const rows = await service.listMyReservations(req.user.id);
  res.json(rows);
}

async function cancel(req, res) {
  try {
    await service.cancelReservation({
      userId: req.user.id,
      reservationId: req.params.id,
    });
    res.json({ message: "Réservation annulée" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { create, mine, cancel };
