const repo = require("./slots.repository");
const roomsRepo = require("../rooms/rooms.repository");

function isValidDateTime(value) {
  // attend un format "YYYY-MM-DD HH:MM:SS" ou "YYYY-MM-DDTHH:MM" etc.
  const d = new Date(value);
  return !isNaN(d.getTime());
}

async function listRoomSlots(roomId) {
  // vérifier que la salle existe (pro)
  const room = await roomsRepo.findById(roomId);
  if (!room) throw new Error("Salle introuvable");

  return repo.findByRoomId(roomId);
}

async function createSlot(roomId, start_at) {
  const room = await roomsRepo.findById(roomId);
  if (!room) throw new Error("Salle introuvable");

  if (!start_at) throw new Error("Champ manquant: start_at");
  if (!isValidDateTime(start_at)) throw new Error("Date/heure invalide");

  const id = await repo.create({ room_id: roomId, start_at });
  return repo.findById(id);
}

module.exports = { listRoomSlots, createSlot };
