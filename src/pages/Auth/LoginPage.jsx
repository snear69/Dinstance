import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, sendOTP, verifyOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [otpCode, setOtpCode] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await sendOTP(email);
      if (data.token) {
        // Direct Login Success
        navigate('/dashboard');
      } else {
        setStep(2);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await verifyOTP(email, otpCode);
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
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-oracle-blue/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-oracle-purple/10 blur-[120px] rounded-full" />
      
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
            Welcome Back
          </h1>
          <p className="text-zinc-500">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="relative">
          {/* Animated border glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-oracle-blue via-oracle-purple to-oracle-blue rounded-[2rem] opacity-30 blur-sm animate-pulse" />
          
          <div className="relative bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl">
            <form onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP} className="space-y-6">
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

              {step === 1 ? (
                <>
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
                </>
              ) : (
                <>
                  {/* OTP Code Field */}
                  <div className="space-y-4 text-center">
                    <div className="p-4 bg-oracle-blue/10 border border-oracle-blue/20 rounded-xl">
                      <p className="text-sm text-oracle-blue">
                        Verification code sent to <strong>{email}</strong>
                      </p>
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        6-Digit Code
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          required
                          placeholder="000000"
                          className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white text-2xl tracking-[0.5em] font-mono placeholder-zinc-600 focus:outline-none focus:border-oracle-blue/50 focus:ring-2 focus:ring-oracle-blue/20 transition-all"
                        />
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-zinc-500 hover:text-white transition-colors underline"
                    >
                      Change email address
                    </button>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-oracle-blue to-blue-600 text-black font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-oracle-blue/25 hover:shadow-oracle-blue/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {step === 1 ? 'Send Verification Code' : 'Sign In'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-4 text-zinc-600 font-bold tracking-widest">
                  New to Oracle?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link 
              to="/signup"
              className="w-full py-4 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all font-bold uppercase tracking-wider text-sm"
            >
              Create an Account
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

export default LoginPage;
