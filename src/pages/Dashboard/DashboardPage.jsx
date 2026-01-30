import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wallet, ShoppingCart, History, LogOut, Plus, Download,
  CreditCard, ArrowUpRight, ArrowDownLeft, Sparkles, Package, 
  Loader2, X, Check, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import WalletTopup from '../../components/WalletTopup';

const API_URL = import.meta.env.VITE_API_URL || 'https://oracle-backend-zy42.onrender.com/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, wallet, token, logout, refreshWallet } = useAuth();
  const { items: cartItems, total: cartTotal, removeItem, checkout } = useCart();
  
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [showTopup, setShowTopup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/wallet/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoadingTx(false);
    }
  };

  const handleTopupSuccess = async () => {
    await refreshWallet();
    await fetchTransactions();
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setCheckoutError('');
    setProcessing(true);

    try {
      await checkout();
      setCheckoutSuccess(true);
      await fetchTransactions();
      
      // Redirect to downloads page after a short delay
      setTimeout(() => {
        setCheckoutSuccess(false);
        navigate('/downloads');
      }, 2000);
    } catch (error) {
      setCheckoutError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oracle-dark">
        <Loader2 className="w-8 h-8 text-oracle-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-oracle-dark pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-oracle-blue/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-oracle-purple/5 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              Welcome, <span className="text-oracle-blue">{user.name}</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/downloads"
              className="px-4 py-2 bg-oracle-blue/10 border border-oracle-blue/30 rounded-xl text-oracle-blue hover:bg-oracle-blue/20 transition-all text-sm font-bold flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              My Downloads
            </Link>
            <Link 
              to="/"
              className="px-4 py-2 bg-zinc-800/50 border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:border-white/20 transition-all text-sm font-bold"
            >
              ← Back to Site
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all text-sm font-bold flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Wallet Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 relative group"
          >
            <div className="absolute -inset-0.5 bg-linear-to-r from-oracle-blue via-oracle-purple to-oracle-blue rounded-4xl opacity-30 blur-sm group-hover:opacity-50 transition-opacity" />
            <div className="relative bg-zinc-900/80 backdrop-blur-xl rounded-4xl border border-white/10 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-oracle-blue to-blue-600 flex items-center justify-center shadow-lg shadow-oracle-blue/25">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Wallet Balance</p>
                  <h2 className="text-4xl font-black text-white tracking-tight">
                    {formatCurrency(wallet.balance)}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={() => setShowTopup(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-linear-to-r from-oracle-blue to-blue-600 text-black font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-oracle-blue/25"
                >
                  <Plus className="w-5 h-5" />
                  Top Up with Paystack
                </motion.button>
                <Link
                  to="/#pricing"
                  className="px-6 py-3 bg-zinc-800 border border-white/10 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-zinc-700 transition-all"
                >
                  <Package className="w-5 h-5" />
                  Browse Plans
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/80 backdrop-blur-xl rounded-4xl border border-white/10 p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-oracle-purple" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-xl">
                <span className="text-zinc-500 text-sm">Total Top-ups</span>
                <span className="text-white font-bold">
                  {formatCurrency(transactions.filter(t => t.type === 'topup').reduce((s, t) => s + t.amount, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-xl">
                <span className="text-zinc-500 text-sm">Total Purchases</span>
                <span className="text-white font-bold">
                  {transactions.filter(t => t.type === 'purchase').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-xl">
                <span className="text-zinc-500 text-sm">Cart Items</span>
                <span className="text-oracle-blue font-bold">{cartItems.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Cart Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/80 backdrop-blur-xl rounded-4xl border border-white/10 p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-oracle-blue" />
              Your Cart
            </h3>

            {checkoutSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Checkout successful!
              </motion.div>
            )}

            {checkoutError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {checkoutError}
              </motion.div>
            )}

            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-600 text-sm">Your cart is empty</p>
                <Link to="/#pricing" className="text-oracle-blue text-sm hover:underline mt-2 inline-block">
                  Browse plans →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                    <div>
                      <p className="text-white font-bold text-sm">{item.planName}</p>
                      <p className="text-zinc-500 text-xs">{formatCurrency(item.price)}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-zinc-400 font-bold">Total</span>
                    <span className="text-white font-black text-lg">{formatCurrency(cartTotal)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={processing || wallet.balance < cartTotal}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      wallet.balance >= cartTotal
                        ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : wallet.balance >= cartTotal ? (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pay with Wallet
                      </>
                    ) : (
                      'Insufficient Balance'
                    )}
                  </button>
                  {wallet.balance < cartTotal && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-zinc-600 text-center">
                        Need {formatCurrency(cartTotal - wallet.balance)} more
                      </p>
                      <button
                        onClick={() => setShowTopup(true)}
                        className="w-full py-2 bg-oracle-blue/10 border border-oracle-blue/30 rounded-xl text-oracle-blue text-xs font-bold hover:bg-oracle-blue/20 transition-all"
                      >
                        Top Up Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Transaction History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-zinc-900/80 backdrop-blur-xl rounded-4xl border border-white/10 p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-oracle-purple" />
              Transaction History
            </h3>

            {loadingTx ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-oracle-blue animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-600 text-sm">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {transactions.slice(0, 20).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'topup' ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        {tx.type === 'topup' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{tx.description || tx.planName || 'Transaction'}</p>
                        <p className="text-zinc-600 text-xs">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`font-black ${tx.type === 'topup' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === 'topup' ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Paystack Top-up Modal */}
      <WalletTopup
        isOpen={showTopup}
        onClose={() => setShowTopup(false)}
        onSuccess={handleTopupSuccess}
        userEmail={user?.email}
        token={token}
      />
    </div>
  );
};

export default DashboardPage;
