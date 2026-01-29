import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { ArrowRight, Loader2 } from 'lucide-react';

const PaystackCheckout = ({ amount, planName, popular, promo, cart, updateCart, onSuccess: onFulfillment }) => {
  const isThisPlanSelected = cart?.planName === planName;
  const [email, setEmail] = useState(isThisPlanSelected ? cart.email || '' : '');
  const [showEmailInput, setShowEmailInput] = useState(isThisPlanSelected);
  const [isProcessing, setIsProcessing] = useState(false);

  // IMPORTANT: Never hardcode Paystack keys in the frontend bundle.
  // Set `VITE_PAYSTACK_PUBLIC_KEY` in your environment (see .env.example).
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const hasPublicKey = Boolean(publicKey);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: email || "customer@example.com",
    amount: Math.round(amount * 100), // Amount in kobo
    publicKey: publicKey,
    currency: 'NGN',
    metadata: {
      plan: planName
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handleSuccess = (reference) => {
    console.log('PAYMENT_DEBUG: Success Reference:', reference);
    alert("Payment Successful! Provisioning your infrastructure...");
    setIsProcessing(false);
    setShowEmailInput(false);
    if (onFulfillment) {
      onFulfillment(email);
    }
  };

  const handleClose = () => {
    console.log('Payment closed');
    setIsProcessing(false);
  };

  const handleClick = () => {
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
    
    // Safety timeout to reset processing state if popup doesn't open or hangs
    const safetyTimeout = setTimeout(() => setIsProcessing(false), 30000);

    try {
      initializePayment(
        (ref) => {
          clearTimeout(safetyTimeout);
          handleSuccess(ref);
        },
        () => {
          clearTimeout(safetyTimeout);
          handleClose();
        }
      );
    } catch (error) {
      clearTimeout(safetyTimeout);
      console.error("Paystack initialization failed", error);
      alert("Payment initialization failed. Check console for details.");
      setIsProcessing(false);
    }
  };

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
