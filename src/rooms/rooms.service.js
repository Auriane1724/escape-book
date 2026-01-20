const repo = require("./rooms.repository");

function validateRoom(room) {
  const required = [
    "name",
    "description",
    "duration_minutes",
    "min_players",
    "max_players",
    "price",
  ];
  for (const key of required) {
    if (room[key] === undefined || room[key] === null || room[key] === "") {
      throw new Error(`Champ manquant: ${key}`);
    }
  }

  if (Number(room.min_players) < 1) throw new Error("min_players invalide");
  if (Number(room.max_players) < Number(room.min_players))
    throw new Error("max_players invalide");
  if (Number(room.duration_minutes) <= 0)
    throw new Error("duration_minutes invalide");
  if (Number(room.price) < 0) throw new Error("price invalide");
}

async function listRooms() {
  return repo.findAll();
}

async function getRoom(id) {
  const room = await repo.findById(id);
  if (!room) throw new Error("Salle introuvable");
  return room;
}

async function createRoom(room) {
  validateRoom(room);
  const id = await repo.create(room);
  return repo.findById(id);
}

async function updateRoom(id, room) {
  validateRoom(room);
  const affected = await repo.update(id, room);
  if (affected === 0) throw new Error("Salle introuvable");
  return repo.findById(id);
}

async function deleteRoom(id) {
  const affected = await repo.remove(id);
  if (affected === 0) throw new Error("Salle introuvable");
  return true;
}

module.exports = { listRooms, getRoom, createRoom, updateRoom, deleteRoom };
