import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'oracle-super-secret-key-2025';

// Middleware to verify JWT token for regular users
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Middleware to verify admin JWT token
export function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Admin access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired admin token' });
    }
    if (!admin.isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    req.admin = admin;
    next();
  });
}

// Generate JWT token for user
export function generateToken(user, expiresIn = '7d') {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name 
    }, 
    JWT_SECRET, 
    { expiresIn }
  );
}

// Generate JWT token for admin
export function generateAdminToken(admin, expiresIn = '24h') {
  return jwt.sign(
    { 
      id: admin.id, 
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isAdmin: true
    }, 
    JWT_SECRET, 
    { expiresIn }
  );
}
