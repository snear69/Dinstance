import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { 
  Download, Package, Check, FileArchive, Shield, Key, 
  FileText, Code, Clock, ArrowLeft, Loader2, AlertCircle,
  ExternalLink, Copy, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://oracle-backend-zy42.onrender.com/api';

const DownloadsPage = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate]);

  const fetchPurchases = async () => {
    try {
      const res = await fetch(`${API_URL}/downloads/purchases`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPurchases(data.purchases || []);
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (purchase) => {
    setDownloading(purchase.id);
    try {
      const res = await fetch(`${API_URL}/downloads/download/${purchase.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `oracle_${purchase.planName.toLowerCase().replace(/\s+/g, '_')}_bundle.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
        // Refresh to update download status
        await fetchPurchases();
      } else {
        alert('Failed to download. Please try again.');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPlanColor = (planName) => {
    switch (planName) {
      case 'Zero Free': return 'from-emerald-500 to-teal-600';
      case 'Starter': return 'from-zinc-400 to-zinc-600';
      case 'Pro': return 'from-oracle-blue to-blue-600';
      case 'Enterprise': return 'from-oracle-purple to-purple-600';
      default: return 'from-oracle-blue to-blue-600';
    }
  };

  if (loading) {
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

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link 
                to="/dashboard"
                className="p-2 bg-zinc-800/50 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                My <span className="text-oracle-blue">Downloads</span>
              </h1>
            </div>
            <p className="text-zinc-500 ml-12">Access your purchased assets and deployment bundles</p>
          </div>
        </div>

        {/* No Purchases */}
        {purchases.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-3xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Purchases Yet</h2>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">
              Once you purchase a plan, your downloadable assets will appear here.
            </p>
            <Link
              to="/#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-oracle-blue text-black font-bold rounded-xl hover:bg-white transition-colors"
            >
              Browse Plans
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Purchases List */}
            {purchases.map((purchase, idx) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${getPlanColor(purchase.planName)} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-black/20 backdrop-blur flex items-center justify-center">
                        <Package className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white">{purchase.planName}</h3>
                        <p className="text-white/70 text-sm">Lifetime License</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs uppercase tracking-wider">Purchased</p>
                      <p className="text-white font-bold">{formatDate(purchase.purchasedAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* What's Included */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                      <Key className="w-5 h-5 text-oracle-blue" />
                      <div>
                        <p className="text-white font-bold text-sm">API Keys</p>
                        <p className="text-zinc-500 text-xs">Production ready</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                      <FileText className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white font-bold text-sm">Documentation</p>
                        <p className="text-zinc-500 text-xs">Full API reference</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                      <Code className="w-5 h-5 text-oracle-purple" />
                      <div>
                        <p className="text-white font-bold text-sm">SDK Examples</p>
                        <p className="text-zinc-500 text-xs">Ready to use</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-bold text-sm">Certificate</p>
                        <p className="text-zinc-500 text-xs">Ownership proof</p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-zinc-800/30 rounded-xl">
                    <div className="flex-1 min-w-[150px]">
                      <p className="text-zinc-500 text-xs uppercase tracking-wider">Transaction ID</p>
                      <div className="flex items-center gap-2">
                        <code className="text-white text-sm font-mono">{purchase.id.slice(0, 16)}...</code>
                        <button 
                          onClick={() => copyToClipboard(purchase.id, purchase.id)}
                          className="text-zinc-500 hover:text-oracle-blue transition-colors"
                        >
                          {copied === purchase.id ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[100px]">
                      <p className="text-zinc-500 text-xs uppercase tracking-wider">Amount Paid</p>
                      <p className="text-white font-bold">{formatCurrency(purchase.amount)}</p>
                    </div>
                    <div className="flex-1 min-w-[100px]">
                      <p className="text-zinc-500 text-xs uppercase tracking-wider">Status</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-400 font-bold text-sm">Active</span>
                      </div>
                    </div>
                    {purchase.downloaded && (
                      <div className="flex-1 min-w-[100px]">
                        <p className="text-zinc-500 text-xs uppercase tracking-wider">Downloaded</p>
                        <div className="flex items-center gap-2 text-oracle-blue">
                          <Check className="w-4 h-4" />
                          <span className="font-bold text-sm">Yes</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Download Button */}
                  <motion.button
                    onClick={() => handleDownload(purchase)}
                    disabled={downloading === purchase.id}
                    whileHover={{ scale: downloading === purchase.id ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-linear-to-r from-oracle-blue to-blue-600 text-black font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-oracle-blue/25 disabled:opacity-70 transition-all"
                  >
                    {downloading === purchase.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Bundle...
                      </>
                    ) : (
                      <>
                        <FileArchive className="w-5 h-5" />
                        Download Bundle (.ZIP)
                      </>
                    )}
                  </motion.button>

                  {purchase.downloaded && (
                    <p className="text-center text-zinc-600 text-xs mt-3 flex items-center justify-center gap-2">
                      <Clock className="w-3 h-3" />
                      You can download this bundle anytime
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6"
            >
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-oracle-blue" />
                Important Information
              </h4>
              <ul className="space-y-2 text-zinc-500 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  Your API keys are unique and generated fresh with each download
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  Keep your secret tokens secure and never share them publicly
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  Your license is permanent and doesn't expire
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  Contact support@oracle-endpoint.com for any issues
                </li>
              </ul>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadsPage;
