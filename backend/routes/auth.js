import express from 'express';
import bcrypt from 'bcryptjs';
import db, { generateId, timestamp } from '../db/index.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    await db.read();

    // Check if user exists
    const existingUser = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const userId = generateId();
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      name,
      verified: false,
      createdAt: timestamp()
    };

    // Create wallet for user
    const newWallet = {
      userId,
      balance: 0,
      currency: 'NGN',
      createdAt: timestamp(),
      updatedAt: timestamp()
    };

    db.data.users.push(newUser);
    db.data.wallets.push(newWallet);
    await db.write();

    // Generate token
    const token = generateToken(newUser);

    console.log(`[AUTH] New user registered: ${email}`);

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      },
      token
    });
  } catch (error) {
    console.error('[AUTH ERROR]', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    await db.read();

    // Find user
    const user = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get wallet balance
    const wallet = db.data.wallets.find(w => w.userId === user.id);

    // Generate token
    const token = generateToken(user);

    console.log(`[AUTH] User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      wallet: {
        balance: wallet?.balance || 0,
        currency: wallet?.currency || 'NGN'
      },
      token
    });
  } catch (error) {
    console.error('[AUTH ERROR]', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    await db.read();

    const user = db.data.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wallet = db.data.wallets.find(w => w.userId === user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        verified: user.verified,
        createdAt: user.createdAt
      },
      wallet: {
        balance: wallet?.balance || 0,
        currency: wallet?.currency || 'NGN'
      }
    });
  } catch (error) {
    console.error('[AUTH ERROR]', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Logout (client-side token deletion, but we can track it)
router.post('/logout', authenticateToken, (req, res) => {
  console.log(`[AUTH] User logged out: ${req.user.email}`);
  res.json({ message: 'Logged out successfully' });
});

export default router;
