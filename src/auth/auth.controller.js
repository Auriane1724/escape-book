const authService = require("./auth.service");

async function register(req, res) {
  try {
    const userId = await authService.register(req.body);
    res.status(201).json({ message: "Utilisateur créé", userId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  me,
};

async function me(req, res) {
  res.json({ user: req.user });
}
