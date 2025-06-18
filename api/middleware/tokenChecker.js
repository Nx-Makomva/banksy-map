const JWT = require("jsonwebtoken");

// Middleware function to check for valid tokens
function tokenChecker(req, res, next) {
  let token;
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Only log error if it's not the /users/current endpoint
    if (req.path !== '/current') {
      console.log("Auth Error: No token provided");
    }
    return next(); // Let it continue to getCurrentUser which handles no user_id
  }

  if (authHeader) {
    token = authHeader.slice(7);
  }

  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    const user_id = payload.sub;

    if (!user_id) {
      throw new Error("No sub claim in JWT token");
    }

    // Add the user_id from the payload to the Express req object.
    req.user_id = user_id;
    next();
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(err);
    }
    res.status(401).json({ message: "auth error" });
  }
}

module.exports = tokenChecker;
