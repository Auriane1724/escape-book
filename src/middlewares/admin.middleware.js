function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Accès admin requis" });
  }
  next();
}

module.exports = adminMiddleware;
