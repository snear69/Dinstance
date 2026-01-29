import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength indicators
  const passwordChecks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password)
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-oracle-dark" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-oracle-purple/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-oracle-blue/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-oracle-blue to-oracle-purple flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">ORACLE</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            Create Account
          </h1>
          <p className="text-zinc-500">Join Oracle and start building today</p>
        </div>

        {/* Signup Card */}
        <div className="relative">
          {/* Animated border glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-oracle-purple via-oracle-blue to-oracle-purple rounded-[2rem] opacity-30 blur-sm animate-pulse" />
          
          <div className="relative bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-oracle-blue/50 focus:ring-2 focus:ring-oracle-blue/20 transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-oracle-blue/50 focus:ring-2 focus:ring-oracle-blue/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-oracle-blue/50 focus:ring-2 focus:ring-oracle-blue/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength */}
                {password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 mt-3"
                  >
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            passwordStrength >= level 
                              ? level <= 1 ? 'bg-red-500' 
                                : level <= 2 ? 'bg-orange-500' 
                                : level <= 3 ? 'bg-yellow-500' 
                                : 'bg-green-500'
                              : 'bg-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className={`flex items-center gap-1 ${passwordChecks.length ? 'text-green-400' : 'text-zinc-600'}`}>
                        <Check className="w-3 h-3" /> 6+ characters
                      </div>
                      <div className={`flex items-center gap-1 ${passwordChecks.uppercase ? 'text-green-400' : 'text-zinc-600'}`}>
                        <Check className="w-3 h-3" /> Uppercase
                      </div>
                      <div className={`flex items-center gap-1 ${passwordChecks.lowercase ? 'text-green-400' : 'text-zinc-600'}`}>
                        <Check className="w-3 h-3" /> Lowercase
                      </div>
                      <div className={`flex items-center gap-1 ${passwordChecks.number ? 'text-green-400' : 'text-zinc-600'}`}>
                        <Check className="w-3 h-3" /> Number
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-4 py-4 bg-zinc-800/50 border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' 
                        : confirmPassword && password === confirmPassword
                          ? 'border-green-500/50 focus:border-green-500/50 focus:ring-green-500/20'
                          : 'border-white/10 focus:border-oracle-blue/50 focus:ring-oracle-blue/20'
                    }`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-oracle-purple to-purple-600 text-white font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-oracle-purple/25 hover:shadow-oracle-purple/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Terms */}
              <p className="text-[10px] text-zinc-600 text-center leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-oracle-blue hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-oracle-blue hover:underline">Privacy Policy</Link>
              </p>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-4 text-zinc-600 font-bold tracking-widest">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link 
              to="/login"
              className="w-full py-4 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Sign In Instead
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="text-zinc-600 hover:text-zinc-400 transition-colors text-sm font-medium"
          >
            ← Back to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
