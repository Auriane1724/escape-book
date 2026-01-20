const db = require("../config/db");

async function findAll() {
  const [rows] = await db.query(
    "SELECT id, name, description, duration_minutes, min_players, max_players, price FROM rooms ORDER BY id DESC"
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.query(
    "SELECT id, name, description, duration_minutes, min_players, max_players, price FROM rooms WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function create(room) {
  const {
    name,
    description,
    duration_minutes,
    min_players,
    max_players,
    price,
  } = room;

  const [result] = await db.query(
    `INSERT INTO rooms (name, description, duration_minutes, min_players, max_players, price)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, duration_minutes, min_players, max_players, price]
  );

  return result.insertId;
}

async function update(id, room) {
  const {
    name,
    description,
    duration_minutes,
    min_players,
    max_players,
    price,
  } = room;

  const [result] = await db.query(
    `UPDATE rooms
     SET name=?, description=?, duration_minutes=?, min_players=?, max_players=?, price=?
     WHERE id=?`,
    [name, description, duration_minutes, min_players, max_players, price, id]
  );

  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query("DELETE FROM rooms WHERE id = ?", [id]);
  return result.affectedRows;
}

module.exports = { findAll, findById, create, update, remove };
