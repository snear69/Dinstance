import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, X, CreditCard, Check, AlertCircle, Wallet } from 'lucide-react';

// Load Paystack script dynamically
const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve(window.PaystackPop);
      return;
    }
    
    const existingScript = document.getElementById('paystack-script');
    if (existingScript) {
      if (window.PaystackPop) {
        resolve(window.PaystackPop);
      } else {
        existingScript.addEventListener('load', () => resolve(window.PaystackPop));
        existingScript.addEventListener('error', () => reject(new Error('Failed to load Paystack script')));
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      if (window.PaystackPop) {
        resolve(window.PaystackPop);
      } else {
        reject(new Error('Paystack script loaded but PaystackPop not found'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.head.appendChild(script);
  });
};

const API_URL = import.meta.env.VITE_API_URL || 'https://oracle-backend-zy42.onrender.com/api';
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const WalletTopup = ({ isOpen, onClose, onSuccess, userEmail, token }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handlePaystackPayment = useCallback(async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 100) {
      setError('Minimum top-up amount is ₦100');
      return;
    }

    if (!PAYSTACK_PUBLIC_KEY) {
      setError('Payment Public Key is missing in .env file.');
      return;
    }

    if (!userEmail) {
      setError('User email is required for payment.');
      return;
    }

    setError('');
    setIsProcessing(true);

    const handleSuccess = async (response) => {
      console.log('Payment successful:', response);
      
      // Credit the wallet via our backend
      try {
        const res = await fetch(`${API_URL}/wallet/topup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: numAmount,
            reference: response.reference
          })
        });

        const contentType = res.headers.get("content-type");
        let data;
        if (contentType && contentType.indexOf("application/json") !== -1) {
          data = await res.json();
        }

        if (res.ok) {
          setSuccess(true);
          setAmount('');
          if (onSuccess) {
            onSuccess(numAmount);
          }
          setTimeout(() => {
            setSuccess(false);
            onClose();
          }, 2000);
        } else {
          setError(data?.error || `Server error (${res.status}). Please contact support.`);
        }
      } catch (err) {
        console.error('Wallet credit error:', err);
        setError(`Failed to connect to server. Check if your backend is running at ${API_URL}`);
      }
      setIsProcessing(false);
    };

    try {
      console.log('Initializing Paystack with:', { key: PAYSTACK_PUBLIC_KEY ? 'Present' : 'Missing', email: userEmail, amount: numAmount });
      const PaystackPop = await loadPaystackScript();
      
      const reference = `wallet_topup_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: userEmail,
        amount: Math.round(numAmount * 100), // Amount in kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          type: 'wallet_topup',
          custom_fields: [
            {
              display_name: "Transaction Type",
              variable_name: "transaction_type",
              value: "Wallet Top-up"
            }
          ]
        },
        onClose: () => {
          console.log('Payment window closed');
          setIsProcessing(false);
          setError('');
        },
        callback: (response) => {
          handleSuccess(response);
        }
      });

      if (!handler) {
        throw new Error('Failed to create Paystack handler');
      }

      handler.openIframe();
    } catch (err) {
      console.error('Paystack initialization error:', err);
      setError(`Payment initialization failed: ${err.message || 'Unknown error'}. Check if your Public Key is valid.`);
      setIsProcessing(false);
    }
  }, [amount, userEmail, PAYSTACK_PUBLIC_KEY, token, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-zinc-900 rounded-[2rem] border border-white/10 p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-oracle-blue to-blue-600 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Top Up Wallet</h3>
                <p className="text-xs text-zinc-500">Powered by Paystack</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success State */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3"
            >
              <Check className="w-5 h-5" />
              <span>Wallet credited successfully!</span>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Quick Amounts */}
          <div className="mb-6">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Quick Select</p>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => { setAmount(quickAmount.toString()); setError(''); }}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    amount === quickAmount.toString()
                      ? 'bg-oracle-blue text-black'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  {formatCurrency(quickAmount)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Custom Amount</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(''); }}
                placeholder="Enter amount"
                min="100"
                className="w-full pl-10 pr-4 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-oracle-blue/50 focus:ring-2 focus:ring-oracle-blue/20 transition-all text-lg font-bold"
              />
            </div>
            <p className="text-[10px] text-zinc-600 mt-2">Minimum: ₦100</p>
          </div>

          {/* Payment Button */}
          <motion.button
            onClick={handlePaystackPayment}
            disabled={isProcessing || !amount}
            whileHover={{ scale: !isProcessing && amount ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-oracle-blue to-blue-600 text-black font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-oracle-blue/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay {amount ? formatCurrency(parseFloat(amount) || 0) : 'Now'}
              </>
            )}
          </motion.button>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-zinc-600 text-[10px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="uppercase tracking-widest font-bold">Secured by Paystack • 256-bit SSL</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletTopup;
