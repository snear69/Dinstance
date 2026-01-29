import express from 'express';
import db, { generateId, timestamp } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendPurchaseReceipt } from '../utils/email.js';

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    await db.read();

    let cart = db.data.carts.find(c => c.userId === req.user.id);
    
    if (!cart) {
      // Create empty cart if doesn't exist
      cart = {
        userId: req.user.id,
        items: [],
        createdAt: timestamp(),
        updatedAt: timestamp()
      };
      db.data.carts.push(cart);
      await db.write();
    }

    // Calculate totals
    const total = cart.items.reduce((sum, item) => sum + item.price, 0);

    res.json({
      items: cart.items,
      total,
      currency: 'NGN',
      itemCount: cart.items.length
    });
  } catch (error) {
    console.error('[CART ERROR]', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { planName, priceNGN, priceUSD, description } = req.body;

    if (!planName || !priceNGN) {
      return res.status(400).json({ error: 'Plan name and price required' });
    }

    await db.read();

    let cartIndex = db.data.carts.findIndex(c => c.userId === req.user.id);
    
    if (cartIndex === -1) {
      // Create new cart
      db.data.carts.push({
        userId: req.user.id,
        items: [],
        createdAt: timestamp(),
        updatedAt: timestamp()
      });
      cartIndex = db.data.carts.length - 1;
    }

    // Check if item already in cart
    const existingItem = db.data.carts[cartIndex].items.find(i => i.planName === planName);
    if (existingItem) {
      return res.status(400).json({ error: 'Item already in cart' });
    }

    // Add item
    const newItem = {
      id: generateId(),
      planName,
      price: priceNGN,
      priceUSD,
      description: description || `${planName} API Plan`,
      addedAt: timestamp()
    };

    db.data.carts[cartIndex].items.push(newItem);
    db.data.carts[cartIndex].updatedAt = timestamp();
    await db.write();

    const total = db.data.carts[cartIndex].items.reduce((sum, item) => sum + item.price, 0);

    console.log(`[CART] Item added: ${req.user.email} - ${planName}`);

    res.json({
      message: 'Item added to cart',
      item: newItem,
      total,
      itemCount: db.data.carts[cartIndex].items.length
    });
  } catch (error) {
    console.error('[CART ERROR]', error);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', authenticateToken, async (req, res) => {
  try {
    await db.read();

    const cartIndex = db.data.carts.findIndex(c => c.userId === req.user.id);
    if (cartIndex === -1) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = db.data.carts[cartIndex].items.findIndex(i => i.id === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    const removedItem = db.data.carts[cartIndex].items.splice(itemIndex, 1)[0];
    db.data.carts[cartIndex].updatedAt = timestamp();
    await db.write();

    const total = db.data.carts[cartIndex].items.reduce((sum, item) => sum + item.price, 0);

    console.log(`[CART] Item removed: ${req.user.email} - ${removedItem.planName}`);

    res.json({
      message: 'Item removed from cart',
      removedItem,
      total,
      itemCount: db.data.carts[cartIndex].items.length
    });
  } catch (error) {
    console.error('[CART ERROR]', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    await db.read();

    const cartIndex = db.data.carts.findIndex(c => c.userId === req.user.id);
    if (cartIndex === -1) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    db.data.carts[cartIndex].items = [];
    db.data.carts[cartIndex].updatedAt = timestamp();
    await db.write();

    console.log(`[CART] Cart cleared: ${req.user.email}`);

    res.json({
      message: 'Cart cleared',
      total: 0,
      itemCount: 0
    });
  } catch (error) {
    console.error('[CART ERROR]', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Checkout with wallet
router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    await db.read();

    // Get cart
    const cartIndex = db.data.carts.findIndex(c => c.userId === req.user.id);
    if (cartIndex === -1 || db.data.carts[cartIndex].items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const cart = db.data.carts[cartIndex];
    const total = cart.items.reduce((sum, item) => sum + item.price, 0);

    // Get wallet
    const walletIndex = db.data.wallets.findIndex(w => w.userId === req.user.id);
    if (walletIndex === -1) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const wallet = db.data.wallets[walletIndex];

    // Check balance
    if (wallet.balance < total) {
      return res.status(400).json({
        error: 'Insufficient wallet balance',
        required: total,
        available: wallet.balance,
        shortfall: total - wallet.balance,
        suggestion: 'Top up your wallet or pay with Paystack'
      });
    }

    // Deduct from wallet
    db.data.wallets[walletIndex].balance -= total;
    db.data.wallets[walletIndex].updatedAt = timestamp();

    // Create transaction for each item
    const transactions = cart.items.map(item => ({
      id: generateId(),
      userId: req.user.id,
      type: 'purchase',
      amount: -item.price,
      planName: item.planName,
      description: `Purchased: ${item.planName}`,
      status: 'completed',
      createdAt: timestamp()
    }));

    db.data.transactions.push(...transactions);

    // Clear cart
    const purchasedItems = [...cart.items];
    db.data.carts[cartIndex].items = [];
    db.data.carts[cartIndex].updatedAt = timestamp();

    await db.write();

    // Send email receipt
    sendPurchaseReceipt(req.user.email, req.user.name, purchasedItems, total, db.data.wallets[walletIndex].balance);

    console.log(`[CHECKOUT] Success: ${req.user.email} - ₦${total}`);

    res.json({
      message: 'Checkout successful',
      purchasedItems,
      totalPaid: total,
      newBalance: db.data.wallets[walletIndex].balance,
      transactions
    });
  } catch (error) {
    console.error('[CART ERROR]', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

export default router;
