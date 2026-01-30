import { Resend } from 'resend';
import dotenv from 'dotenv';
import process from 'process';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTopupReceipt = async (email, name, amount, reference) => {
  try {
    await resend.emails.send({
      from: 'Oracle Payments <payments@resend.dev>',
      to: email,
      subject: 'Wallet Top-up Successful',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00BAFF;">Wallet Top-up Successful</h2>
          <p>Hello ${name},</p>
          <p>Your wallet has been credited with <strong>₦${amount.toLocaleString()}</strong>.</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">Transaction Reference:</p>
            <p style="margin: 5px 0 0; font-family: monospace; font-weight: bold;">${reference}</p>
          </div>
          <p>You can now use your balance to purchase API plans.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">If you didn't perform this transaction, please contact support immediately.</p>
        </div>
      `
    });
    console.log(`[EMAIL] Top-up receipt sent to ${email}`);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send top-up receipt:', error);
  }
};

export const sendPurchaseReceipt = async (email, name, items, total, balance) => {
  try {
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${item.planName}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">₦${item.price.toLocaleString()}</td>
      </tr>
    `).join('');

    await resend.emails.send({
      from: 'Oracle Orders <orders@resend.dev>',
      to: email,
      subject: 'Order Confirmation - Oracle Endpoint',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00BAFF;">Order Confirmation</h2>
          <p>Hello ${name},</p>
          <p>Thank you for your purchase. Your order is now being processed.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="text-align: left; color: #666; font-size: 12px; text-transform: uppercase;">
                <th style="padding-bottom: 10px; border-bottom: 2px solid #eee;">Plan</th>
                <th style="padding-bottom: 10px; border-bottom: 2px solid #eee; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 15px 0; font-weight: bold;">Total Paid</td>
                <td style="padding: 15px 0; font-weight: bold; text-align: right;">₦${total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background: #e6f7ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; text-align: center;">
              <strong>New Wallet Balance:</strong> ₦${balance.toLocaleString()}
            </p>
          </div>

          <p>You can access your documentation and SDKs in your dashboard:</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/downloads" style="display: block; width: 200px; margin: 20px auto; padding: 12px; background: #00BAFF; color: white; text-align: center; border-radius: 5px; text-decoration: none; font-weight: bold;">Access Downloads</a>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} Oracle Endpoint. All rights reserved.</p>
        </div>
      `
    });
    console.log(`[EMAIL] Purchase receipt sent to ${email}`);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send purchase receipt:', error);
  }
};

export const sendOTP = async (email, code) => {
  const isPlaceholder = process.env.RESEND_API_KEY === 're_your_test_key_here' || !process.env.RESEND_API_KEY;
  
  if (isPlaceholder) {
    console.log(`[MOCK EMAIL] To: ${email}, Code: ${code}`);
    console.warn(`[WARNING] Using mock email mode. Set a real RESEND_API_KEY to send actual emails.`);
    return { mock: true };
  }

  try {
    await resend.emails.send({
      from: 'Oracle Auth <auth@resend.dev>',
      to: email,
      subject: `${code} is your Oracle verification code`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #09090b; color: white; border-radius: 20px; border: 1px solid #27272a;">
          <h2 style="color: #00BAFF; margin-bottom: 24px;">Verify your email</h2>
          <p style="color: #a1a1aa; font-size: 16px; line-height: 24px;">
            Use the following verification code to sign in to your Oracle account. This code will expire in 10 minutes.
          </p>
          <div style="background: #18181b; padding: 24px; border-radius: 12px; text-align: center; margin: 32px 0; border: 1px solid #27272a;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: white;">${code}</span>
          </div>
          <p style="color: #71717a; font-size: 14px;">
            If you didn't request this code, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;">
          <p style="font-size: 12px; color: #52525b; text-align: center;">
            © ${new Date().getFullYear()} Oracle Endpoint. Built for the next generation of developers.
          </p>
        </div>
      `
    });
    console.log(`[EMAIL] OTP sent to ${email}`);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send OTP:', error);
    // In production, we might want to throw, but for demo let's log and allow login for a specific test user
    if (email === 'stxminus@gmail.com' || email === 'davidolagbenro35@gmail.com') {
       console.log('[DEBUG] Allowing test user login despite email failure');
       return { error: 'Email service unreachable', debug: true };
    }
    throw error;
  }
};
