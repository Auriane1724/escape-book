const db = require("../config/db");

async function findByRoomId(roomId) {
  const [rows] = await db.query(
    `SELECT id, room_id, start_at, status
     FROM slots
     WHERE room_id = ?
     ORDER BY start_at ASC`,
    [roomId]
  );
  return rows;
}

async function create({ room_id, start_at }) {
  const [result] = await db.query(
    `INSERT INTO slots (room_id, start_at, status)
     VALUES (?, ?, 'OPEN')`,
    [room_id, start_at]
  );
  return result.insertId;
}

async function findById(id) {
  const [rows] = await db.query(
    `SELECT id, room_id, start_at, status
     FROM slots
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { findByRoomId, create, findById };
