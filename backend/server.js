import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import process from 'node:process';
import { initDB } from './db/index.js';

// Import routes
import authRoutes from './routes/auth.js';
import walletRoutes from './routes/wallet.js';
import cartRoutes from './routes/cart.js';
import adminRoutes from './routes/admin.js';
import downloadsRoutes from './routes/downloads.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Initialize database
await initDB();
console.log('[DB] Database initialized');

const resend = new Resend(process.env.RESEND_API_KEY);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/downloads', downloadsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Legacy cart endpoints (keeping for backward compatibility)
const carts = new Map();

app.post('/api/cart-legacy', (req, res) => {
  const { email, planName } = req.body;
  if (!email || !planName) return res.status(400).json({ error: 'Missing data' });
  
  carts.set(email, { planName, updatedAt: new Date() });
  console.log(`Cart updated for ${email}: ${planName}`);
  res.json({ message: 'Cart saved' });
});

app.get('/api/cart-legacy/:email', (req, res) => {
  const cart = carts.get(req.params.email);
  if (!cart) return res.status(404).json({ error: 'Cart not found' });
  res.json(cart);
});

// Paystack Webhook
app.post('/api/webhook/paystack', async (req, res) => {
  const event = req.body;
  
  if (event.event === 'charge.success') {
    const { email } = event.data.customer;
    const { amount, metadata } = event.data;
    const planName = metadata?.plan || 'Starter';

    console.log(`[PAYSTACK WEBHOOK] Success event received for: ${email}`);
    console.log(`[PAYSTACK WEBHOOK] Plan: ${planName}, Amount: ${amount}`);

    try {
      await resend.emails.send({
        from: 'Oracle Onboarding <onboarding@resend.dev>',
        to: email,
        subject: `Your ${planName} Documentation is Ready`,
        html: `
          <h1>Thanks for your purchase!</h1>
          <p>Your <strong>${planName}</strong> infrastructure is now provisioned.</p>
          <p>You can download your SDK and documentation using the link below:</p>
          <a href="https://oracle-endpoint.dev/docs/bundle_${planName.toLowerCase()}.zip" style="padding: 10px 20px; background: #00BAFF; color: black; border-radius: 5px; text-decoration: none;">Download Now</a>
          <br/><br/>
          <p>Or use your Master Token: <code>sk_oracle_live_${Math.random().toString(36).substring(7)}</code></p>
        `
      });
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  res.status(200).send('OK');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Oracle Backend running on port ${PORT}`);
  console.log(`📦 API endpoints ready at http://localhost:${PORT}/api`);
});
