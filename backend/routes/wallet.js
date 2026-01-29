import express from 'express';
import db, { generateId, timestamp } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendTopupReceipt } from '../utils/email.js';

const router = express.Router();

// Get wallet balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    await db.read();

    const wallet = db.data.wallets.find(w => w.userId === req.user.id);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({
      balance: wallet.balance,
      currency: wallet.currency,
      lastUpdated: wallet.updatedAt
    });
  } catch (error) {
    console.error('[WALLET ERROR]', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

// Top up wallet (called after Paystack success)
router.post('/topup', authenticateToken, async (req, res) => {
  try {
    const { amount, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    await db.read();

    // Find wallet
    const walletIndex = db.data.wallets.findIndex(w => w.userId === req.user.id);
    if (walletIndex === -1) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Update wallet balance
    db.data.wallets[walletIndex].balance += amount;
    db.data.wallets[walletIndex].updatedAt = timestamp();

    // Create transaction record
    const transaction = {
      id: generateId(),
      userId: req.user.id,
      type: 'topup',
      amount,
      description: 'Wallet top-up via Paystack',
      reference: reference || null,
      status: 'completed',
      createdAt: timestamp()
    };
    db.data.transactions.push(transaction);

    await db.write();

    // Send email receipt
    sendTopupReceipt(req.user.email, req.user.name, amount, reference);

    console.log(`[WALLET] Top-up: ${req.user.email} +₦${amount}`);

    res.json({
      message: 'Top-up successful',
      newBalance: db.data.wallets[walletIndex].balance,
      transaction
    });
  } catch (error) {
    console.error('[WALLET ERROR]', error);
    res.status(500).json({ error: 'Top-up failed' });
  }
});

// Pay from wallet
router.post('/pay', authenticateToken, async (req, res) => {
  try {
    const { amount, planName, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    await db.read();

    // Find wallet
    const walletIndex = db.data.wallets.findIndex(w => w.userId === req.user.id);
    if (walletIndex === -1) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const wallet = db.data.wallets[walletIndex];

    // Check sufficient balance
    if (wallet.balance < amount) {
      return res.status(400).json({ 
        error: 'Insufficient balance',
        required: amount,
        available: wallet.balance,
        shortfall: amount - wallet.balance
      });
    }

    // Deduct from wallet
    db.data.wallets[walletIndex].balance -= amount;
    db.data.wallets[walletIndex].updatedAt = timestamp();

    // Create transaction record
    const transaction = {
      id: generateId(),
      userId: req.user.id,
      type: 'purchase',
      amount: -amount,
      planName: planName || null,
      description: description || `Purchase: ${planName}`,
      status: 'completed',
      createdAt: timestamp()
    };
    db.data.transactions.push(transaction);

    await db.write();

    console.log(`[WALLET] Payment: ${req.user.email} -₦${amount} for ${planName}`);

    res.json({
      message: 'Payment successful',
      newBalance: db.data.wallets[walletIndex].balance,
      transaction
    });
  } catch (error) {
    console.error('[WALLET ERROR]', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    await db.read();

    const transactions = db.data.transactions
      .filter(t => t.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ transactions });
  } catch (error) {
    console.error('[WALLET ERROR]', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

export default router;
