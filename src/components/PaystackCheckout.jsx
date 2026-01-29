import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

// Load Paystack script dynamically
const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve(window.PaystackPop);
      return;
    }
    
    const existingScript = document.getElementById('paystack-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.PaystackPop));
      return;
    }

    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(window.PaystackPop);
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.head.appendChild(script);
  });
};

const PaystackCheckout = ({ amount, planName, popular, promo, cart, updateCart, onSuccess: onFulfillment }) => {
  const isThisPlanSelected = cart?.planName === planName;
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Keep local state in sync with global cart
  const cartEmail = cart?.email;
  useEffect(() => {
    if (isThisPlanSelected) {
      setEmail(cartEmail || '');
      setShowEmailInput(true);
    } else {
      setShowEmailInput(false);
      setEmail('');
    }
  }, [isThisPlanSelected, cartEmail]);

  // IMPORTANT: Never hardcode Paystack keys in the frontend bundle.
  // Set `VITE_PAYSTACK_PUBLIC_KEY` in your environment (see .env.example).
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const hasPublicKey = Boolean(publicKey);

  const handleSuccess = useCallback((reference) => {
    console.log('PAYMENT_DEBUG: Success Reference:', reference);
    alert("Payment Successful! Provisioning your infrastructure...");
    setIsProcessing(false);
    setShowEmailInput(false);
    if (onFulfillment) {
      onFulfillment(email);
    }
  }, [email, onFulfillment]);

  const handleClose = useCallback(() => {
    console.log('Payment closed');
    setIsProcessing(false);
  }, []);

  const handleClick = useCallback(async () => {
    if (!hasPublicKey) {
      alert('Payment is not configured. Missing VITE_PAYSTACK_PUBLIC_KEY.');
      return;
    }
    if (!showEmailInput) {
      setShowEmailInput(true);
      updateCart({ planName, email: '' });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);

    try {
      // Ensure Paystack is loaded
      const PaystackPop = await loadPaystackScript();
      
      const handler = PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: Math.round(amount * 100), // Amount in kobo
        currency: 'NGN',
        ref: `oracle_${planName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        metadata: {
          plan: planName,
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan",
              value: planName
            }
          ]
        },
        onClose: () => {
          handleClose();
        },
        callback: (response) => {
          handleSuccess(response);
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error("Paystack initialization failed", error);
      alert("Payment initialization failed. Please try again.");
      setIsProcessing(false);
    }
  }, [hasPublicKey, showEmailInput, email, publicKey, amount, planName, updateCart, handleClose, handleSuccess]);

  if (showEmailInput) {
    return (
      <div className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={async (e) => {
            const val = e.target.value;
            setEmail(val);
            updateCart({ planName, email: val });
            
            // Sync with backend if it's a valid email
            if (val.includes('@') && val.includes('.') && backendUrl) {
              try {
                await fetch(`${backendUrl}/api/cart`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: val, planName })
                });
              } catch {
                console.warn("Backend sync failed - staying local");
              }
            }
          }}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-oracle-blue transition-colors text-white"
        />
        <button 
          onClick={handleClick}
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${popular ? 'bg-oracle-blue text-black hover:bg-white' : promo ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-white/5 text-white hover:bg-white/10'}`}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Processing...
            </>
          ) : (
            <>
              Complete Purchase <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleClick}
      disabled={!hasPublicKey}
      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${popular ? 'bg-oracle-blue text-black hover:bg-white' : promo ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-white/5 text-white hover:bg-white/10'}`}
    >
      Get Started <ArrowRight size={18} />
    </button>
  );
};

export default PaystackCheckout;
