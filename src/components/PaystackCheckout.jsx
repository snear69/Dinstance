import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { ArrowRight, Loader2 } from 'lucide-react';

const PaystackCheckout = ({ amount, planName, popular, onSuccess: onFulfillment }) => {
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: email || "customer@example.com",
    amount: amount * 100, // Amount in kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
    metadata: {
      plan: planName
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handleSuccess = (reference) => {
    console.log('Payment successful', reference);
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
    if (!showEmailInput) {
      setShowEmailInput(true);
      return;
    }
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    setIsProcessing(true);
    initializePayment(handleSuccess, handleClose);
  };

  if (showEmailInput) {
    return (
      <div className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-oracle-blue transition-colors"
        />
        <button 
          onClick={handleClick}
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${popular ? 'bg-oracle-blue text-black hover:bg-white' : 'bg-white/5 text-white hover:bg-white/10'}`}
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
      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${popular ? 'bg-oracle-blue text-black hover:bg-white' : 'bg-white/5 text-white hover:bg-white/10'}`}
    >
      Get Started <ArrowRight size={18} />
    </button>
  );
};

export default PaystackCheckout;
