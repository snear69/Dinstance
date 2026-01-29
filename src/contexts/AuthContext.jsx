import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState({ balance: 0, currency: 'NGN' });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('oracle_token'));

  // Check auth status on mount
  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setWallet(data.wallet);
      } else {
        // Token invalid, clear everything
        logout();
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('oracle_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setWallet(data.wallet);
    
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    localStorage.setItem('oracle_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setWallet({ balance: 0, currency: 'NGN' });
    
    return data;
  };

  const logout = () => {
    localStorage.removeItem('oracle_token');
    setToken(null);
    setUser(null);
    setWallet({ balance: 0, currency: 'NGN' });
  };

  const refreshWallet = async () => {
    if (!token) return;
    
    try {
      const res = await fetch(`${API_URL}/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setWallet({
          balance: data.balance,
          currency: data.currency
        });
      }
    } catch (error) {
      console.error('Wallet refresh error:', error);
    }
  };

  const value = {
    user,
    wallet,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshWallet,
    fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
