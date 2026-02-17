const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authMiddleware = (req, res, next) => {
  try {
    const headers = req.headers;
    const requiredHeaders =  ['x-client-type', 'x-game-client', 'x-timestamp', 'x-platform'];

    for (const header of requiredHeaders) {
      if (!headers[header]) {
        return res.status(400).json({ error: `Missing required header` });
      }
    }
    if (headers['x-client-type'] !== 'unity-game') {
        return res.status(403).json({ error: 'Invalid client type' });
    }
    if (headers['x-game-client'] !== 'brackeys-2026-1') {
        return res.status(403).json({ error: 'Invalid game client' });
    }

    const timestamp = parseInt(headers['x-timestamp']);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > 300) { // 5 minute window
        return res.status(403).json({ error: 'Request expired' });
    }

    // Get token from header
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = authMiddleware;
