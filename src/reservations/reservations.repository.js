const db = require("../config/db");

async function create({ user_id, slot_id, players_count }) {
  const [result] = await db.query(
    `INSERT INTO reservations (user_id, slot_id, players_count)
     VALUES (?, ?, ?)`,
    [user_id, slot_id, players_count]
  );
  return result.insertId;
}

async function findById(id) {
  const [rows] = await db.query(
    `SELECT id, user_id, slot_id, players_count, created_at, cancelled_at
     FROM reservations
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findMine(userId) {
  const [rows] = await db.query(
    `SELECT r.id, r.players_count, r.created_at, r.cancelled_at,
            s.id AS slot_id, s.start_at, s.status,
            rm.id AS room_id, rm.name AS room_name
     FROM reservations r
     JOIN slots s ON s.id = r.slot_id
     JOIN rooms rm ON rm.id = s.room_id
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC`,
    [userId]
  );
  return rows;
}
async function cancel(id, userId) {
  const [result] = await db.query(
    `UPDATE reservations
     SET cancelled_at = NOW()
     WHERE id = ? AND user_id = ? AND cancelled_at IS NULL`,
    [id, userId]
  );
  return result.affectedRows;
}

module.exports = { create, findById, findMine, cancel };
