const jwt = require('jsonwebtoken');

// checks if the user is logged in
const auth = (req, res, next) => {

  // split(' ') cuts it into ['Bearer', 'xxxxx'] and we grab index 1
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // no token = not logged in, stop here
  if (!token) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  // check if the token is real and not expired
  // used AI, prompt: "how to verify jwt token in express"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // save userId so the next route can use it
    req.userId = decoded.userId;

    next();

  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

};

module.exports = auth;