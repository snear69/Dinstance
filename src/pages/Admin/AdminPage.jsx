import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CreditCard, TrendingUp, ShieldCheck, LogOut, Loader2,
  ArrowUpRight, ArrowDownLeft, RefreshCw, Search, UserPlus,
  Wallet, Activity, Eye, EyeOff, Lock, Mail, User
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('oracle_admin_token'));
  const [admin, setAdmin] = useState(null);
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [setupKey, setSetupKey] = useState('');
  const [setupName, setSetupName] = useState('');

  // Dashboard state
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (adminToken) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [adminToken]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setIsLoggedIn(true);
        fetchUsers();
        fetchTransactions();
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Users fetch error:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/transactions`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Transactions fetch error:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('oracle_admin_token', data.token);
      setAdminToken(data.token);
      setAdmin(data.admin);
      setIsLoggedIn(true);
      await fetchStats();
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch(`${API_URL}/admin/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          name: setupName,
          setupKey 
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Setup failed');
      }

      setShowSetup(false);
      setLoginError('');
      alert('Admin account created! Please login.');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('oracle_admin_token');
    setAdminToken(null);
    setAdmin(null);
    setIsLoggedIn(false);
    setStats(null);
    setUsers([]);
    setTransactions([]);
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t =>
    t.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.planName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 text-oracle-purple animate-spin" />
      </div>
    );
  }

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-oracle-purple to-purple-800 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-oracle-purple/25">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Admin Portal</h1>
            <p className="text-zinc-500 text-sm">Oracle Management Console</p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8">
            <form onSubmit={showSetup ? handleSetup : handleLogin} className="space-y-5">
              {loginError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {loginError}
                </div>
              )}

              {showSetup && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Setup Key</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="password"
                        value={setupKey}
                        onChange={(e) => setSetupKey(e.target.value)}
                        required
                        placeholder="Enter setup key"
                        className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-oracle-purple/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Admin Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="text"
                        value={setupName}
                        onChange={(e) => setSetupName(e.target.value)}
                        required
                        placeholder="Your name"
                        className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-oracle-purple/50 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@oracle.dev"
                    className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-oracle-purple/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-oracle-purple/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-4 bg-gradient-to-r from-oracle-purple to-purple-700 text-white font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-oracle-purple/25 disabled:opacity-50"
              >
                {loginLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : showSetup ? (
                  'Create Admin Account'
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <button
                onClick={() => setShowSetup(!showSetup)}
                className="w-full text-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showSetup ? '← Back to Login' : 'First time? Setup Admin Account'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-zinc-950 pt-8 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-oracle-purple to-purple-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
              <p className="text-zinc-500 text-sm">Oracle Management Console</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { fetchStats(); fetchUsers(); fetchTransactions(); }}
              className="px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm">Total Users</p>
                <p className="text-3xl font-black text-white">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm">Total Wallet Balance</p>
                <p className="text-3xl font-black text-white">{formatCurrency(stats?.totalWalletBalance || 0)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm">Total Transactions</p>
                <p className="text-3xl font-black text-white">{stats?.totalTransactions || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'users', 'transactions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-oracle-purple text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        {activeTab !== 'overview' && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-oracle-purple/50 transition-all"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {transactions.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
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
                        <p className="text-white font-bold text-sm">{tx.userEmail}</p>
                        <p className="text-zinc-600 text-xs">{tx.description || tx.planName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black ${tx.type === 'topup' ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.type === 'topup' ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                      </p>
                      <p className="text-zinc-600 text-xs">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Wallet Balance</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">{user.name}</p>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 font-bold">{formatCurrency(user.walletBalance)}</span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-sm">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          tx.type === 'topup' 
                            ? 'bg-green-500/10 text-green-400' 
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white">{tx.userEmail}</td>
                      <td className="px-6 py-4 text-zinc-400">{tx.description || tx.planName || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${tx.type === 'topup' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type === 'topup' ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-sm">{formatDate(tx.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
