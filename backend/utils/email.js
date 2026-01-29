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
