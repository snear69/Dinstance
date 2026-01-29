const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Resend } = require('resend');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory "database" for carts (In production, use MongoDB or PostgreSQL)
const carts = new Map();

// Save/Update Cart
app.post('/api/cart', (req, res) => {
  const { email, planName } = req.body;
  if (!email || !planName) return res.status(400).json({ error: 'Missing data' });
  
  carts.set(email, { planName, updatedAt: new Date() });
  console.log(`Cart updated for ${email}: ${planName}`);
  res.json({ message: 'Cart saved' });
});

// Retrieve Cart
app.get('/api/cart/:email', (req, res) => {
  const cart = carts.get(req.params.email);
  if (!cart) return res.status(404).json({ error: 'Cart not found' });
  res.json(cart);
});

// Paystack Webhook
app.post('/api/webhook/paystack', async (req, res) => {
  const event = req.body;
  
  // Verify signature (Simplified for now - in production use crypto to verify X-Paystack-Signature)
  if (event.event === 'charge.success') {
    const { email } = event.data.customer;
    const { amount, metadata } = event.data;
    const planName = metadata?.plan || 'Starter';

    console.log(`Payment confirmed for ${email}: ${planName}`);

    try {
      // Send Fulfillment Email
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
app.listen(PORT, () => console.log(`Oracle Backend running on port ${PORT}`));
