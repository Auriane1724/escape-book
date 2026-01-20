const service = require("./slots.service");

async function listByRoom(req, res) {
  try {
    const slots = await service.listRoomSlots(Number(req.params.roomId));
    res.json(slots);
  } catch (err) {
    const code = err.message === "Salle introuvable" ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
}

async function createForRoom(req, res) {
  try {
    const slot = await service.createSlot(
      Number(req.params.roomId),
      req.body.start_at
    );
    res.status(201).json(slot);
  } catch (err) {
    const code = err.message === "Salle introuvable" ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
}

module.exports = { listByRoom, createForRoom };
