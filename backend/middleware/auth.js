const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [, token] = auth.split(" ");
    if (!token) return res.status(401).json({ message: "Unauthenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET); // { userId, isAdmin, department, iat, exp }
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
