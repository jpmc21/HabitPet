const jwt = require('jsonwebtoken');

// checks if the user is logged in
const auth = (req, res, next) => {
  const publicRoutes = ["/api/auth/login", "/api/auth/register"];

  if (process.env.NODE_ENV === "test") {
    publicRoutes.push("/api/testing/cleanup-user");
  }

  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // split(' ') cuts it into ['Bearer', 'xxxxx'] and we grab index 1
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

// require login
  if (!token) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  // check if the token is real and not expired
  // used AI, prompt: "how to verify jwt token in express"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // save userId so the next route can use it
    req.userId = decoded.userId;

    // TODO: Currently async, but could be sync if we just store userId in token and not do a DB lookup here

    next();

  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

};

module.exports = auth;