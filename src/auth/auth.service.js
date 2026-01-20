const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

async function register({ firstname, lastname, email, password }) {
  // vérifier si l'email existe déjà
  const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);

  if (existing.length > 0) {
    throw new Error("Email déjà utilisé");
  }

  // hash du mot de passe
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // insertion utilisateur
  const [result] = await db.query(
    `INSERT INTO users (firstname, lastname, email, password_hash)
     VALUES (?, ?, ?, ?)`,
    [firstname, lastname, email, passwordHash]
  );

  return result.insertId;
}

async function login({ email, password }) {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  if (rows.length === 0) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const user = rows[0];

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error("Email ou mot de passe incorrect");
  }

  // génération JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = {
  register,
  login,
};
