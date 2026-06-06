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
  // [GenAI Use] Prompt: "In an Express middleware, how do I verify a JWT token and attach the userId to the request so the next route can use it?"
  try {
    // [GenAI Use] LLM Response Start
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    // [GenAI Use] LLM Response End
    // [GenAI Use] Reflection: jwt.verify throws if the token is expired or fake, so one catch handles both cases. I only grab userId from decoded because that's all our routes actually need

    // save userId so the next route can use it
    // TODO: Currently async, but could be sync if we just store userId in token and not do a DB lookup here

    next();

  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

};

module.exports = auth;