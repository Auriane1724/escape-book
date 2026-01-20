const service = require("./rooms.service");

async function list(req, res) {
  const rooms = await service.listRooms();
  res.json(rooms);
}

async function get(req, res) {
  try {
    const room = await service.getRoom(req.params.id);
    res.json(room);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const room = await service.createRoom(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const room = await service.updateRoom(req.params.id, req.body);
    res.json(room);
  } catch (err) {
    const code = err.message === "Salle introuvable" ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await service.deleteRoom(req.params.id);
    res.json({ message: "Salle supprimée" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = { list, get, create, update, remove };
