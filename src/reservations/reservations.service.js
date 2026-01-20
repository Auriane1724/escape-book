const repo = require("./reservations.repository");
const db = require("../config/db");

async function createReservation({ userId, slot_id, players_count }) {
  if (!slot_id) throw new Error("Champ manquant: slot_id");
  if (!players_count) throw new Error("Champ manquant: players_count");

  const slotIdNum = Number(slot_id);
  const playersNum = Number(players_count);

  if (Number.isNaN(slotIdNum) || slotIdNum <= 0)
    throw new Error("slot_id invalide");
  if (Number.isNaN(playersNum) || playersNum <= 0)
    throw new Error("players_count invalide");

  // Vérifier que le slot existe et qu’il est OPEN + récupérer la salle pour min/max joueurs
  const [rows] = await db.query(
    `SELECT s.id, s.status, rm.min_players, rm.max_players
     FROM slots s
     JOIN rooms rm ON rm.id = s.room_id
     WHERE s.id = ?`,
    [slotIdNum]
  );

  if (rows.length === 0) throw new Error("Créneau introuvable");
  const slot = rows[0];

  if (slot.status !== "OPEN") throw new Error("Créneau non disponible");
  if (playersNum < slot.min_players || playersNum > slot.max_players) {
    throw new Error(
      `Nombre de joueurs doit être entre ${slot.min_players} et ${slot.max_players}`
    );
  }

  try {
    const id = await repo.create({
      user_id: userId,
      slot_id: slotIdNum,
      players_count: playersNum,
    });
    return repo.findById(id);
  } catch (err) {
    // ER_DUP_ENTRY = slot déjà réservé (à cause du UNIQUE(slot_id))
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("Ce créneau est déjà réservé");
    }
    throw err;
  }
}

async function listMyReservations(userId) {
  return repo.findMine(userId);
}
async function cancelReservation({ userId, reservationId }) {
  const resIdNum = Number(reservationId);
  if (Number.isNaN(resIdNum) || resIdNum <= 0)
    throw new Error("reservationId invalide");

  // récupérer slot_id de la réservation (pour rouvrir le slot)
  const [rows] = await db.query(
    "SELECT id, slot_id, cancelled_at FROM reservations WHERE id = ? AND user_id = ?",
    [resIdNum, userId]
  );

  if (rows.length === 0) throw new Error("Réservation introuvable");
  if (rows[0].cancelled_at) throw new Error("Réservation déjà annulée");

  // annuler
  const affected = await repo.cancel(resIdNum, userId);
  if (affected === 0) throw new Error("Annulation impossible");

  // rouvrir le slot
  await db.query("UPDATE slots SET status='OPEN' WHERE id = ?", [
    rows[0].slot_id,
  ]);

  return true;
}

module.exports = { createReservation, listMyReservations, cancelReservation };
