import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Menu, X, ShoppingCart, User, LogIn, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = ({ cart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, wallet, isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Features', id: 'features' },
    { name: 'API', id: 'api' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'Guidelines', id: 'guidelines' },
    { name: 'Contact', id: 'contact' },
  ];

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    if (window.location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, null, `#${id}`);
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-3 bg-black/80 backdrop-blur-xl border-b border-white/10' : 'py-6 bg-transparent'}`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group relative z-[110]">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-xl bg-oracle-blue/10 flex items-center justify-center border border-oracle-blue/20"
          >
            <Cpu className="text-oracle-blue w-6 h-6" />
          </motion.div>
          <span className="text-xl font-bold tracking-tighter text-white group-hover:text-oracle-blue transition-colors">
            ORACLE <span className="text-oracle-blue">ENDPOINT</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link, idx) => (
            <motion.a
              key={link.name}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(e, link.id)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-oracle-blue transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-oracle-blue transition-all group-hover:w-full"></span>
            </motion.a>
          ))}

          {/* User is Authenticated */}
          {isAuthenticated ? (
            <>
              {/* Wallet Balance */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all"
              >
                <Wallet size={16} />
                <span className="text-xs font-black">{formatCurrency(wallet.balance)}</span>
              </Link>

              {/* Cart Button */}
              <Link
                to="/dashboard"
                className="relative p-2 rounded-xl bg-zinc-800/50 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
              >
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-oracle-blue text-black text-[10px] font-black rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-oracle-blue/10 border border-oracle-blue/30 text-oracle-blue hover:bg-oracle-blue/20 transition-all"
              >
                <User size={16} />
                <span className="text-xs font-black uppercase tracking-wide">
                  {user?.name?.split(' ')[0] || 'Dashboard'}
                </span>
              </Link>
            </>
          ) : (
            <>
              {/* Cart Indicator (legacy) */}
              {cart?.planName && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-oracle-blue/20 border border-oracle-blue/50 text-[11px] font-black uppercase text-oracle-blue shadow-[0_0_20px_rgba(0,186,255,0.2)]"
                >
                  <div className="relative">
                    <ShoppingCart size={16} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse shadow-lg"></span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[8px] text-oracle-blue/60 mb-0.5">Current Order</span>
                    <span>{cart.planName} Tier</span>
                  </div>
                </motion.div>
              )}

              {/* Login Button */}
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/50 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all text-xs font-bold uppercase tracking-wider"
              >
                <LogIn size={16} />
                Login
              </Link>

              {/* Get Started Button */}
              <motion.a
                href="#pricing"
                onClick={(e) => scrollToSection(e, 'pricing')}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,186,255,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-xl bg-oracle-blue text-black text-xs font-black uppercase tracking-widest text-center"
              >
                Get Started
              </motion.a>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-10 h-10 glass rounded-lg flex items-center justify-center text-white relative z-[110]" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-199 bg-black md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-200 bg-[#0a0a0a] md:hidden flex flex-col"
          >
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center px-6 py-6 border-b border-white/10 bg-black">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-oracle-blue/10 flex items-center justify-center border border-oracle-blue/20">
                  <Cpu className="text-oracle-blue w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tighter text-white">
                  ORACLE <span className="text-oracle-blue">ENDPOINT</span>
                </span>
              </Link>
              <button 
                className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Mobile Menu Links */}
            <div className="flex flex-col items-center justify-center flex-1 p-8 gap-6 bg-[#0a0a0a]">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={`#${link.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className="text-4xl font-black text-white hover:text-oracle-blue transition-colors uppercase tracking-tighter"
                >
                  {link.name}
                </motion.a>
              ))}

              {/* Auth Links for Mobile */}
              {isAuthenticated ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400"
                  >
                    <Wallet size={20} />
                    <span className="text-lg font-black">{formatCurrency(wallet.balance)}</span>
                  </motion.div>
                  <Link 
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-4 px-12 py-5 rounded-2xl bg-oracle-blue text-black font-black text-xl shadow-[0_0_40px_rgba(0,186,255,0.3)] uppercase tracking-widest text-center"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-4 px-12 py-5 rounded-2xl bg-zinc-800 border border-white/10 text-white font-black text-xl uppercase tracking-widest text-center"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-12 py-5 rounded-2xl bg-oracle-blue text-black font-black text-xl shadow-[0_0_40px_rgba(0,186,255,0.3)] uppercase tracking-widest text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            
              <div className="absolute bottom-12 text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em]">
                Secure Protocol Active
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
