import express from 'express';
import bcrypt from 'bcryptjs';
import db, { generateId, timestamp } from '../db/index.js';
import { authenticateAdmin, generateAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    await db.read();

    // Find admin
    const admin = db.data.admins?.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Generate admin token
    const token = generateAdminToken(admin);

    console.log(`[ADMIN] Admin logged in: ${email}`);

    res.json({
      message: 'Admin login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      token
    });
  } catch (error) {
    console.error('[ADMIN ERROR]', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// Get all users (admin only)
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    await db.read();

    const users = db.data.users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      verified: u.verified,
      createdAt: u.createdAt
    }));

    // Get wallets for each user
    const usersWithWallets = users.map(user => {
      const wallet = db.data.wallets.find(w => w.userId === user.id);
      return {
        ...user,
        walletBalance: wallet?.balance || 0
      };
    });

    res.json({ 
      users: usersWithWallets,
      total: users.length 
    });
  } catch (error) {
    console.error('[ADMIN ERROR]', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get all transactions (admin only)
router.get('/transactions', authenticateAdmin, async (req, res) => {
  try {
    await db.read();

    const transactions = db.data.transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(t => {
        const user = db.data.users.find(u => u.id === t.userId);
        return {
          ...t,
          userEmail: user?.email || 'Unknown'
        };
      });

    // Calculate totals
    const totalRevenue = transactions
      .filter(t => t.type === 'topup')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPurchases = transactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    res.json({ 
      transactions,
      stats: {
        totalTransactions: transactions.length,
        totalRevenue,
        totalPurchases
      }
    });
  } catch (error) {
    console.error('[ADMIN ERROR]', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Dashboard stats (admin only)
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    await db.read();

    const totalUsers = db.data.users.length;
    const totalWalletBalance = db.data.wallets.reduce((sum, w) => sum + w.balance, 0);
    const totalTransactions = db.data.transactions.length;
    
    const recentTransactions = db.data.transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(t => {
        const user = db.data.users.find(u => u.id === t.userId);
        return { ...t, userEmail: user?.email || 'Unknown' };
      });

    const recentUsers = db.data.users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        createdAt: u.createdAt
      }));

    res.json({
      stats: {
        totalUsers,
        totalWalletBalance,
        totalTransactions
      },
      recentTransactions,
      recentUsers
    });
  } catch (error) {
    console.error('[ADMIN ERROR]', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Create new admin (super admin only)
router.post('/create', authenticateAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Super admin privileges required' });
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields required' });
    }

    await db.read();

    // Check if admin exists
    const existing = db.data.admins?.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Admin already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = {
      id: generateId(),
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: 'admin',
      createdAt: timestamp()
    };

    if (!db.data.admins) db.data.admins = [];
    db.data.admins.push(newAdmin);
    await db.write();

    console.log(`[ADMIN] New admin created: ${email}`);

    res.status(201).json({
      message: 'Admin created',
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('[ADMIN ERROR]', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

// Initialize first admin (one-time setup)
router.post('/setup', async (req, res) => {
  try {
    const { email, password, name, setupKey } = req.body;

    // Simple setup key for security
    if (setupKey !== 'ORACLE_ADMIN_SETUP_2025') {
      return res.status(403).json({ error: 'Invalid setup key' });
    }

    await db.read();

    // Check if any admin exists
    if (db.data.admins && db.data.admins.length > 0) {
      const hasRealAdmin = db.data.admins.some(a => !a.passwordHash.includes('placeholder'));
      if (hasRealAdmin) {
        return res.status(400).json({ error: 'Admin already configured' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = {
      id: 'admin-001',
      email: email.toLowerCase(),
      passwordHash,
      name: name || 'Oracle Admin',
      role: 'super_admin',
      createdAt: timestamp()
    };

    db.data.admins = [newAdmin];
    await db.write();

    console.log(`[ADMIN] Initial admin setup complete: ${email}`);

    res.status(201).json({
      message: 'Admin setup complete',
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('[ADMIN ERROR]', error);
    res.status(500).json({ error: 'Admin setup failed' });
  }
});

export default router;
