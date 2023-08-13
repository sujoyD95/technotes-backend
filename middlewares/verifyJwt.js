const jwt = require("jsonwebtoken");

const VerifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_KEY_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;

    next();
  });
};
module.exports = VerifyJwt;
